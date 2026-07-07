import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../theme';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  data: DropdownItem[];
  value: string;
  onChange: (item: DropdownItem) => void;
  placeholder?: string;
  error?: string;
  selectedTextColor?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  data,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  selectedTextColor,
}) => {
  const [visible, setVisible] = useState(false);

  const selectedItem = data.find((item) => item.value === value);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dropdown,
          error ? styles.dropdownError : null
        ]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[
          selectedItem ? styles.selectedText : styles.placeholder,
          selectedItem && selectedTextColor ? { color: selectedTextColor } : null
        ]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={styles.icon}>▼</Text>
      </TouchableOpacity>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{label}</Text>
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.item,
                        item.value === value && styles.itemSelected
                      ]}
                      onPress={() => {
                        onChange(item);
                        setVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          item.value === value && styles.itemTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.slate[900],
    // backgroundColor: Colors.slate[700],
    marginBottom: Spacing.xs,
  },
  dropdown: {
    height: 48,
    // backgroundColor: Colors.slate[800],
    borderWidth: 1,
    borderColor: Colors.slate[200],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownError: {
    borderColor: Colors.error,
  },
  placeholder: {
    color: Colors.slate[500],
    fontSize: Typography.sizes.md,
  },
  selectedText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
  },
  icon: {
    color: Colors.slate[400],
    fontSize: 12,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // Dark semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.slate[800],
    borderRadius: BorderRadius.lg,
    maxHeight: '50%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.slate[700],
  },
  modalTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.slate[500],
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[700],
    textAlign: 'center',
  },
  item: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[700],
  },
  itemSelected: {
    backgroundColor: Colors.slate[700],
  },
  itemText: {
    fontSize: Typography.sizes.md,
    color: Colors.slate[300],
    textAlign: 'center',
  },
  itemTextSelected: {
    color: Colors.accent,
    fontWeight: Typography.weights.bold,
  },
});
