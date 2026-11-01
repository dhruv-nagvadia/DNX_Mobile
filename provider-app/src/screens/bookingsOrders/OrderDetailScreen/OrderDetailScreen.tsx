import React from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Package, ReceiptText } from 'lucide-react-native';

import { ActionModal } from '@/components/ActionModal';
import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { Color } from '@/utils/Theme';
import { formatMoney } from '@/utils/money';
import { orderNeedsCollection, orderStatusBadge, paymentBadge } from '@/utils/status';
import { BusinessOrder } from '@/redux/api/business/types';

import { useOrderDetailScreen } from './useOrderDetailScreen';
import { styles } from './styles';

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

function lineTotal(item: BusinessOrder['items'][number]) {
  return (item.quantity / item.priceQty) * item.priceMinor;
}

export default function OrderDetailScreen() {
  const {
    order,
    isLoading,
    refreshing,
    refresh,
    actionLoading,
    advance,
    collectNow,
    showCancel,
    reason,
    setReason,
    openCancel,
    closeCancel,
    submitCancel,
    goBack,
  } = useOrderDetailScreen();

  if (!order) {
    return (
      <View style={styles.root}>
        <AppHeader title="Order" onBack={goBack} />
        {!isLoading && (
          <EmptyState icon={<ReceiptText size={48} color={Color.placeholder} strokeWidth={1.4} />} title="Order not found" />
        )}
      </View>
    );
  }

  const statusInfo = orderStatusBadge(order.status);
  const payInfo = paymentBadge({
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    amountMinor: order.amountMinor,
    amountPaidMinor: order.amountPaidMinor,
    refundedMinor: order.refundedMinor,
    currency: order.currency,
  });
  const total = order.items.reduce((sum, i) => sum + lineTotal(i), 0) || order.amountMinor;
  const due = order.amountMinor - order.amountPaidMinor;
  const needsCollect = orderNeedsCollection(order);

  return (
    <View style={styles.root}>
      <AppHeader title={order.provider.businessName} onBack={goBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.customer}>
              <Text style={styles.customerName}>{order.user.fullName}</Text>
              {!!order.user.phone && <Text style={styles.meta}>{order.user.phone}</Text>}
              <Text style={styles.meta}>{dateFmt.format(new Date(order.createdAt))}</Text>
            </View>
            <View style={styles.statusStack}>
              <StatusBadge label={statusInfo.label} tone={statusInfo.tone} cutRight />
              <StatusBadge label={payInfo.label} tone={payInfo.tone} cutRight />
            </View>
          </View>
          {!!order.note && <Text style={styles.note}>Note: {order.note}</Text>}
          {!!order.cancelReason && <Text style={styles.note}>Cancelled: {order.cancelReason}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items ({order.items.length})</Text>
          {order.items.map((item, i) => (
            <View key={item.id} style={[styles.itemRow, i === 0 && styles.itemRowFirst]}>
              {item.product?.imageUrl ? (
                <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
              ) : (
                <View style={styles.itemImageFallback}>
                  <Package size={18} color={Color.placeholder} />
                </View>
              )}
              <View style={styles.itemMain}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.meta}>
                  {item.quantity} {item.unit} · {formatMoney(item.priceMinor, order.currency)} / {item.priceQty}{' '}
                  {item.unit}
                </Text>
              </View>
              <Text style={styles.itemTotal}>{formatMoney(lineTotal(item), order.currency)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.meta}>Total</Text>
            <Text style={styles.summaryValue}>{formatMoney(total, order.currency)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.meta}>Paid</Text>
            <Text style={styles.summaryValue}>{formatMoney(order.amountPaidMinor, order.currency)}</Text>
          </View>
          {due > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.meta}>Due</Text>
              <Text style={[styles.summaryValue, styles.summaryDue]}>{formatMoney(due, order.currency)}</Text>
            </View>
          )}
          {!!order.refundedMinor && (
            <View style={styles.summaryRow}>
              <Text style={styles.meta}>Refunded</Text>
              <Text style={styles.summaryValue}>{formatMoney(order.refundedMinor, order.currency)}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          {order.status === 'PENDING' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={actionLoading}
              onPress={() => advance('CONFIRMED')}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Confirm</Text>
            </TouchableOpacity>
          )}
          {order.status === 'CONFIRMED' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={actionLoading}
              onPress={() => advance('READY')}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Mark ready</Text>
            </TouchableOpacity>
          )}
          {order.status === 'READY' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              disabled={actionLoading}
              onPress={() => advance('COMPLETED')}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>Complete</Text>
            </TouchableOpacity>
          )}
          {(order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'READY') && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger]}
              disabled={actionLoading}
              onPress={openCancel}
            >
              <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Cancel</Text>
            </TouchableOpacity>
          )}
          {needsCollect && (
            <TouchableOpacity style={styles.actionBtn} disabled={actionLoading} onPress={collectNow}>
              <Text style={styles.actionBtnText}>Collect {formatMoney(due, order.currency)}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <ActionModal
        visible={showCancel}
        title="Cancel this order?"
        message="Let the customer know why, if you want to."
        reasonValue={reason}
        onReasonChange={setReason}
        confirmLabel="Confirm cancel"
        confirmTone="danger"
        loading={actionLoading}
        onConfirm={submitCancel}
        onCancel={closeCancel}
      />
    </View>
  );
}
