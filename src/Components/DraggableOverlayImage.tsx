import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import MaterialIcons from "@react-native-vector-icons/material-icons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome";


type Props = {
  item: OverlayImageItem;
  onPositionChange: (id: string, x: number, y: number) => void;
  onSelect:(id:string)=>void;
  onDelete:(id:string)=>void;
  onEdit:(id:string)=>void
};

export function DraggableOverlayImage({
  item,
  onSelect,
  onPositionChange,
  onDelete,
  onEdit,
}: Props) {
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

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    width: item.width,
    height: item.height,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity activeOpacity={1} onPress={() =>onSelect(item.id)}>
              
              <Image
                source={{ uri: item.uri }} 
                style={[{
                  width: item.width,
                  height: item.height,
                },item.isSelected&&{borderColor:"#3478C5",borderWidth:3}]}
                resizeMode="cover"
              />
              {
                item.isSelected&&(
                  <View style={{flexDirection:"row",position:"absolute",gap:"20"}}>
                      <TouchableOpacity onPress={()=>onDelete(item.id)} style={{padding:5,backgroundColor:"#ffff",alignSelf:"flex-start",borderRadius:30}}>
                          <FontAwesome5 name='trash' size={15} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>onEdit(item.id)} style={{padding:5,backgroundColor:"#ffff",alignSelf:"flex-end",borderRadius:30}}>
                          <MaterialIcons name='edit' size={15} />
                      </TouchableOpacity>
                  </View>
               )
              }
        </TouchableOpacity>

      </Animated.View>
    </GestureDetector>
  );
}