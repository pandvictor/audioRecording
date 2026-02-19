import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '../components/atoms/AppText';
import { InputTextBox } from '../components/atoms/InputTextBox';
import { ScreenTemplate } from '../components/templates/ScreenTemplate';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';

export const CallsScreen = () => {
  const [inputText, setInputText] = useState('');

  return (
    <ScreenTemplate>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.page}>
          <View style={styles.top}>
            <AppText variant="display">Calls</AppText>
            <AppText variant="body" tone="secondary">
              This screen will host VoIP call transcription once we wire the call stack.
            </AppText>

            <View style={styles.section}>
              <AppText variant="subtitle">Input</AppText>
              <InputTextBox
                placeholder="Type here"
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={4}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.section}>
            <AppText variant="subtitle">Preview</AppText>
            <View style={styles.preview}>
              <ScrollView
                style={styles.previewScroll}
                contentContainerStyle={styles.previewContent}
                showsVerticalScrollIndicator
                nestedScrollEnabled
              >
                <AppText variant="body" tone={inputText ? 'secondary' : 'muted'}>
                  {inputText || 'Your text will appear below.'}
                </AppText>
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  preview: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  previewScroll: {
    maxHeight: 220,
    minHeight: 120,
  },
  previewContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});
