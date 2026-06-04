import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { DragTextEditor as OriginalDragTextEditor } from "react-native-drag-text-editor";
import { RootStackParamList } from "../Routes/RootStackParamList";
const DragTextEditor = OriginalDragTextEditor as any;
type TestEditorPropsType=NativeStackScreenProps<RootStackParamList,"TextEditor">;
export function TextEditorScreen(testEditorPropsType:TestEditorPropsType){
   const parms=testEditorPropsType.route.params;
   const item=parms.textItem;
    return (  
      <View
  key={item.id}
  style={{
    position: 'absolute',
    left: item.x,
    top: item.y,
    width: 220,
    height: 120,
  }}
>
  <DragTextEditor
    visible={true}
    x={0}
    y={0}
    w={220}
    h={120}
    minWidth={100}
    minHeight={50}
    value={item.text}
    placeholder="Type here"
    onChangeText={(text: string) => {
      // update your text state here
    }}
    FontSize={item.fontSize}
    FontColor={item.color}
    isDraggable={true}
    isResizable={true}
    resizerSnapPoints={['right', 'left', 'top', 'bottom']}
    rotationComponent={{
      side: 'bottom',
      customRotationComponent: () => (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#3478C5',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>↻</Text>
        </View>
      ),
    }}
    onItemActive={() => {}}
    onStartRoutine={() => {}}
    onMoveRoutine={() => {}}
    onResizeRoutine={() => {}}
    onRotateRoutine={() => {}}
    onEndRoutine={() => {}}
    externalTextStyles={{
      color: item.color,
      fontSize: item.fontSize,
      fontFamily: item.fontFaimly,
    }}
    externalBorderStyles={{
      borderStyle: 'dashed',
      borderColor: '#ffffff',
    }}
  />
</View>    );
}