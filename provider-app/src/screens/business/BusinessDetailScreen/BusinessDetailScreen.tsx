import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Ban,
  Calendar,
  Clock,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Pencil,
  Phone,
  Scissors,
  ShoppingBag,
  Tag,
  Warehouse,
} from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { EarningsPanel } from '@/components/EarningsPanel';
import { TopSellersPanel } from '@/components/TopSellersPanel';
import { Color } from '@/utils/Theme';
import { INK, LINK, ModernSize, PAGE_BG, TINT } from '@/utils/modernTheme';
import { useBottomInsetStyle } from '@/hooks/useBottomInsetStyle';

import { useBusinessDetailScreen } from './useBusinessDetailScreen';
import {
  AboutText,
  ContactRow,
  HoursList,
  LinkButton,
  ManageTile,
  ReviewCard,
  SectionCard,
  Stars,
  TopCard,
} from './parts';
import { styles } from './styles';

const MANAGE_GAP = 10;

/**
 * Business Detail — same structure as the customer app's business page: a rounded
 * photo card with the business name, rating and status under the image, then white
 * section cards (Manage, Earnings, Top services, About, Hours, Contact, Reviews).
 */
export default function BusinessDetailScreen() {
  const withBottomInset = useBottomInsetStyle();
  const { width } = useWindowDimensions();
  const {
    business,
    isStore,
    isLoading,
    refreshing,
    refresh,
    recentReviews,
    goToHours,
    goToCalendar,
    goToBookingsOrders,
    goToPhotos,
    goToEdit,
    goToServices,
    goToProducts,
    goToStock,
    goToCoupons,
    goToReviews,
    confirmDelete,
    goBack,
  } = useBusinessDetailScreen();

  // Loading / failed to load: a plain header so there is always a way back.
  if (!business) {
    return (
      <View style={styles.container}>
        <AppHeader variant="light" title="Business" onBack={goBack} />
        <View style={styles.center}>
          {isLoading ? (
            <ActivityIndicator color={LINK} />
          ) : (
            <Text style={styles.muted}>Could not load this business. Pull down to try again.</Text>
          )}
        </View>
      </View>
    );
  }

  // 3 tiles per row across the page width.
  const tileW = Math.floor((width - ModernSize.gutter * 2 - MANAGE_GAP * 2) / 3);

  const address = [
    business.addressLine,
    [business.city, business.postalCode].filter(Boolean).join(' – '),
    business.state,
  ]
    .filter(Boolean)
    .join(', ');
  const subline = [business.category.name, business.subcategory?.name].filter(Boolean).join(' · ');
  const itemCount = isStore ? (business.products?.length ?? 0) : (business.services?.length ?? 0);
  const itemsLabel = `${itemCount} ${isStore ? 'product' : 'service'}${itemCount === 1 ? '' : 's'}`;
  const editLink = <LinkButton label="Edit" icon={<Pencil size={14} color={LINK} />} onPress={goToEdit} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PAGE_BG} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={withBottomInset(styles.content)}
        refreshControl={<RefreshControl refreshing={refreshing || isLoading} onRefresh={refresh} />}
      >
        <TopCard
          business={business}
          subline={subline}
          itemsLabel={itemsLabel}
          onBack={goBack}
          onEdit={goToEdit}
          onDelete={confirmDelete}
          onPhotos={goToPhotos}
          onReviews={goToReviews}
          onHours={goToHours}
        />

        <View style={styles.body}>
          {business.isBlocked && (
            <View style={styles.banner}>
              <Ban size={20} color={Color.error} />
              <View style={styles.bannerMain}>
                <Text style={styles.bannerTitle}>Business Blocked</Text>
                <Text style={styles.bannerText}>
                  {business.blockedReason ? `Reason: ${business.blockedReason}. ` : ''}
                  Customers cannot see this business or make {isStore ? 'orders' : 'bookings'}.
                </Text>
              </View>
            </View>
          )}

          {/* ── Manage ─────────────────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Manage</Text>
          <View style={styles.grid}>
            {isStore ? (
              <>
                <ManageTile icon={Package} label="Products" tint={TINT.blue} width={tileW} onPress={goToProducts} />
                <ManageTile icon={Warehouse} label="Stock" tint={TINT.mint} width={tileW} onPress={goToStock} />
                <ManageTile
                  icon={ShoppingBag}
                  label="Orders"
                  tint={TINT.lavender}
                  width={tileW}
                  onPress={goToBookingsOrders}
                />
              </>
            ) : (
              <>
                <ManageTile icon={Scissors} label="Services" tint={TINT.blue} width={tileW} onPress={goToServices} />
                <ManageTile
                  icon={Calendar}
                  label="Bookings"
                  tint={TINT.lavender}
                  width={tileW}
                  onPress={goToBookingsOrders}
                />
              </>
            )}
            <ManageTile icon={Tag} label="Offers" tint={TINT.peach} width={tileW} onPress={goToCoupons} />
            <ManageTile icon={ImageIcon} label="Photos" tint={TINT.mint} width={tileW} onPress={goToPhotos} />
            <ManageTile icon={Clock} label="Hours" tint={TINT.lavender} width={tileW} onPress={goToHours} />
            <ManageTile icon={Calendar} label="Calendar" tint={TINT.blue} width={tileW} onPress={goToCalendar} />
          </View>

          {/* ── Earnings ───────────────────────────────────────────────── */}
          <SectionCard title="Earnings">
            <EarningsPanel businessId={business.id} isStore={isStore} />
          </SectionCard>

          {/* ── Top services / products ────────────────────────────────── */}
          <SectionCard
            title={isStore ? 'Top Products' : 'Top Services'}
            action={<LinkButton label="See all" onPress={isStore ? goToProducts : goToServices} />}
          >
            <TopSellersPanel businessId={business.id} isStore={isStore} />
          </SectionCard>

          {/* ── About ──────────────────────────────────────────────────── */}
          <SectionCard title={`About ${business.businessName}`} action={editLink}>
            {business.description ? (
              <AboutText text={business.description} />
            ) : (
              <Text style={styles.muted}>
                No description yet. A short paragraph about {isStore ? 'your store' : 'what you do'} helps customers
                choose you.
              </Text>
            )}
          </SectionCard>

          {/* ── Opening hours ──────────────────────────────────────────── */}
          <SectionCard
            title="Opening hours"
            action={<LinkButton label="Edit" icon={<Pencil size={14} color={LINK} />} onPress={goToHours} />}
          >
            {business.businessHours?.length ? (
              <HoursList hours={business.businessHours} />
            ) : (
              <Text style={styles.muted}>No opening hours set yet. Customers can't see when you are open.</Text>
            )}
          </SectionCard>

          {/* ── Contact & location ─────────────────────────────────────── */}
          <SectionCard title="Contact & location" action={editLink}>
            <ContactRow icon={<Phone size={20} color={INK} />} label="Phone" value={business.phone} />
            <ContactRow icon={<Mail size={20} color={INK} />} label="Email" value={business.email} />
            <ContactRow icon={<MapPin size={20} color={INK} />} label="Address" value={address} last />
          </SectionCard>

          {/* ── Reviews ────────────────────────────────────────────────── */}
          <SectionCard
            title="Reviews"
            action={
              business.ratingCount > 0 ? (
                <LinkButton
                  label={`View all (${business.ratingCount.toLocaleString('en-IN')})`}
                  onPress={goToReviews}
                />
              ) : undefined
            }
          >
            {business.ratingCount > 0 ? (
              <TouchableOpacity style={styles.summary} onPress={goToReviews} activeOpacity={0.7}>
                <Text style={styles.summaryAvg}>{business.ratingAvg.toFixed(1)}</Text>
                <View style={styles.summaryBody}>
                  <Stars value={business.ratingAvg} size={18} />
                  <Text style={styles.summaryCount}>
                    {business.ratingCount.toLocaleString('en-IN')} review{business.ratingCount === 1 ? '' : 's'}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.reviewEmpty}>
                <MessageSquare size={18} color={Color.placeholder} />
                <Text style={styles.muted}>No reviews yet</Text>
              </View>
            )}
          </SectionCard>
          {recentReviews.map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
