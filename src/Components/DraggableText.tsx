import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';



type Props = {
  item: TextItem;
  onPositionChange: (id: string, x: number, y: number) => void;
};

export function DraggableText({ item, onPositionChange }: Props) {
  
  const translateX = useSharedValue(item.x);
  const translateY = useSharedValue(item.y);

  const startX = useSharedValue(item.x);
  const startY = useSharedValue(item.y);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(event => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd(() => {
      runOnJS(onPositionChange)(
        item.id,
        translateX.value,
        translateY.value
      );
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <Text
          style={{
            color: item.color,
            fontSize: item.fontSize,
            fontFamily: item.fontFaimly,
          }}
        >
          {item.text}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}