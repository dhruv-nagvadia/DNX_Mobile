import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Info, Package, Pencil, Reply } from 'lucide-react-native';

import { businessColor } from '@/screens/catalog/AllOffersScreen/helpers';
import { Color } from '@/utils/Theme';
import { LINK, PILL } from '@/utils/modernTheme';

import { avatarColors, relativeDate, StarRow } from './helpers';
import { styles } from './styles';
import { ReviewItem } from './types';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const CLAMP_LINES = 3;

/** Comment clamped to 3 lines; a hidden full-height copy tells us whether
 * "more" is needed (iOS/Android report clamped lines differently). */
function Comment({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  return (
    <View>
      <Text
        style={[styles.comment, styles.measure]}
        onTextLayout={(e) => setOverflows(e.nativeEvent.lines.length > CLAMP_LINES)}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {text}
      </Text>
      <Text style={styles.comment} numberOfLines={expanded ? undefined : CLAMP_LINES}>
        {text}
      </Text>
      {overflows && (
        <TouchableOpacity onPress={() => setExpanded((v) => !v)} hitSlop={HIT_SLOP} accessibilityRole="button">
          <Text style={styles.moreText}>{expanded ? 'less' : 'more'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface ReviewCardProps {
  item: ReviewItem;
  showBusiness: boolean;
  editing: boolean;
  draft: string;
  maxReply: number;
  error: string | null;
  saving: boolean;
  onDraftChange: (text: string) => void;
  onStartReply: (item: ReviewItem) => void;
  onCancel: () => void;
  onPost: (item: ReviewItem) => void;
  onRemove: (item: ReviewItem) => void;
}

export function ReviewCard({
  item,
  showBusiness,
  editing,
  draft,
  maxReply,
  error,
  saving,
  onDraftChange,
  onStartReply,
  onCancel,
  onPost,
  onRemove,
}: ReviewCardProps) {
  const avatar = avatarColors(item.userName);
  const dot = businessColor(item.businessId || item.businessName);
  const hasReply = !!item.providerReply;

  const businessPill = (
    <View style={[styles.businessPill, { backgroundColor: `${dot}1A` }]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={styles.businessPillText} numberOfLines={1}>
        {item.businessName}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: avatar.bg }]}>
          <Text style={[styles.avatarText, { color: avatar.fg }]}>{item.userName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.cardHead}>
          <View style={styles.cardHeadRow}>
            <View style={styles.nameCol}>
              <Text style={styles.name} numberOfLines={1}>
                {item.userName}
              </Text>
              <Text style={styles.date} numberOfLines={1}>
                {relativeDate(item.createdAt)}
                {item.product && showBusiness ? `  •  ${item.businessName}` : ''}
              </Text>
            </View>
            {item.product ? (
              <View style={styles.productChip}>
                {item.product.imageUrl ? (
                  <Image source={{ uri: item.product.imageUrl }} style={styles.productThumb} />
                ) : (
                  <View style={[styles.productThumb, styles.productThumbEmpty]}>
                    <Package size={18} color={Color.placeholder} />
                  </View>
                )}
                <Text style={styles.productName} numberOfLines={2}>
                  {item.product.name}
                </Text>
              </View>
            ) : (
              showBusiness && businessPill
            )}
          </View>
          <StarRow rating={item.rating} size={20} />
        </View>
      </View>

      <View style={styles.cardBody}>
        {!!item.comment && <Comment text={item.comment} />}

        {hasReply && !editing && (
          <View style={styles.replyBox}>
            <Reply size={20} color={Color.textSecondary} />
            <View style={styles.replyContent}>
              <View style={styles.replyHeadRow}>
                <Text style={styles.replyLabel} numberOfLines={1}>
                  Your reply
                  {!!item.repliedAt && <Text style={styles.replyWhen}>{`  ·  ${relativeDate(item.repliedAt)}`}</Text>}
                </Text>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => onStartReply(item)}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel="Edit reply"
                >
                  <Pencil size={16} color={LINK} />
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.replyText}>{item.providerReply}</Text>
            </View>
          </View>
        )}

        {!hasReply && (
          <View style={styles.needsRow}>
            <View style={styles.needsPill}>
              <Reply size={16} color={PILL.orange.fg} />
              <Text style={styles.needsPillText}>Needs reply</Text>
            </View>
            {!editing && (
              <TouchableOpacity
                style={styles.replyBtn}
                onPress={() => onStartReply(item)}
                accessibilityRole="button"
                accessibilityLabel="Reply to review"
              >
                <Reply size={18} color={LINK} />
                <Text style={styles.replyBtnText}>Reply</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {editing && (
          <View style={styles.composer}>
            <TextInput
              style={styles.composerInput}
              value={draft}
              onChangeText={onDraftChange}
              placeholder="Write a public reply..."
              placeholderTextColor={Color.placeholder}
              multiline
              maxLength={maxReply}
              autoFocus
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.composerActions}>
              <View style={styles.publicNote}>
                <Info size={16} color={LINK} />
                <Text style={styles.publicNoteText} numberOfLines={1}>
                  Replies are public
                </Text>
              </View>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onCancel}
                disabled={saving}
                accessibilityRole="button"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postBtn, saving && styles.postBtnBusy]}
                onPress={() => onPost(item)}
                disabled={saving}
                accessibilityRole="button"
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Color.white} />
                ) : (
                  <Text style={styles.postText}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
            {hasReply && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => onRemove(item)}
                disabled={saving}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
              >
                <Text style={styles.removeText}>Remove reply</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
