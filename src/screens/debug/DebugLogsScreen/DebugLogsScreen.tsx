import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import { AppHeader } from '@/components/AppHeader';
import { Color } from '@/utils/Theme';
import { getLogs, clearLogs, subscribeLogs, LogLevel } from '@/utils/logger';

import { styles } from './styles';

function formatMeta(meta: unknown): string {
  if (typeof meta === 'string') return meta;
  try {
    return JSON.stringify(meta, null, 2);
  } catch {
    return String(meta);
  }
}

const LEVEL_COLOR: Record<LogLevel, string> = {
  API: Color.primary,
  INFO: Color.textSecondary,
  SUCCESS: Color.success,
  WARNING: Color.warning,
  ERROR: Color.error,
};

function time(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** In-app view of the centralized logs (API calls + important events). */
export default function DebugLogsScreen() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => subscribeLogs(force), []);

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const logs = getLogs();

  return (
    <View style={styles.container}>
      <AppHeader title="Debug logs" />

      <View style={styles.toolbar}>
        <Text style={styles.count}>{logs.length} entries · newest first</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={clearLogs}>
          <Trash2 size={14} color={Color.error} />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {logs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No logs yet. Use the app and API calls will appear here.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {logs.map((l) => (
            <View key={l.id} style={styles.row}>
              <View style={styles.head}>
                <View style={[styles.levelChip, { backgroundColor: LEVEL_COLOR[l.level] }]}>
                  <Text style={styles.levelText}>{l.level}</Text>
                </View>
                <Text style={styles.time}>{time(l.ts)}</Text>
                {!!l.tag && (
                  <Text style={styles.tag} numberOfLines={1}>
                    {l.tag}
                  </Text>
                )}
              </View>
              <Text style={styles.message}>{l.message}</Text>
              {l.meta !== undefined && (
                <TouchableOpacity activeOpacity={0.7} onPress={() => toggle(l.id)}>
                  <Text
                    style={[styles.meta, l.level === 'ERROR' && styles.metaError]}
                    numberOfLines={expanded.has(l.id) ? undefined : 4}
                  >
                    {formatMeta(l.meta)}
                  </Text>
                  <Text style={styles.metaToggle}>
                    {expanded.has(l.id) ? 'Tap to collapse' : 'Tap to expand'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
