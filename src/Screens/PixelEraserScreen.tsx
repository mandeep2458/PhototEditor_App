import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  InteractionManager,
} from 'react-native';
import {
  Canvas,
  Image as SkiaImage,
  Path,
  Skia,
  useImage,
  ImageFormat,
  ColorMatrix,
} from '@shopify/react-native-skia';
import RNFS from 'react-native-fs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Routes/RootStackParamList';
import Slider from '@react-native-community/slider';
import { UseImageContext } from '../Context/ImageContext';
import RBSheet from "react-native-raw-bottom-sheet";
import Entypo from 'react-native-vector-icons/Entypo';

const {height, width } = Dimensions.get('window');

type EraserPath = {
  path: any;
  size: number;
};

type Props=NativeStackScreenProps<RootStackParamList,'PixelEraser'>;

export default function PixelEraserScreen({navigation,route}:Props) {
   const canvasRef = useRef<any>(null);
   const {imageUri,setImageUri,imageFilterMatrix}=UseImageContext();

  const image = useImage(imageUri);
  const [eraserSize, setEraserSize] = useState(10);
  const [paths, setPaths] = useState<EraserPath[]>([]);
  const currentPath = useRef<any>(null);

  const canvasWidth = width;
  const canvasHeight = width;
 
  const onTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    const path = Skia.Path.Make();
    path.moveTo(locationX, locationY);

    currentPath.current = path;

    setPaths(prev => [
      ...prev,
      {
        path,
        size: eraserSize,
      },
    ]);
  };
    //  const refRBSheet = useRef();
    const onCancelButtonPressed=()=>{
      navigation.pop();
    }
    const onTouchMove = (event: any) => {
      const { locationX, locationY } = event.nativeEvent;

      if (!currentPath.current) return;

      currentPath.current.lineTo(locationX, locationY);

      // Force re-render
      setPaths(prev => [...prev]);
    };

    const onTouchEnd = () => {
      currentPath.current = null;
    };
    
    if (!image) {
      return null;
    }
    const onDiscardTapped=()=>{
          setPaths([]);
    }
    const onSaveTapped=async()=>{
      try{
 if (!canvasRef.current) return;

      const snapshot = await canvasRef.current.makeImageSnapshotAsync();

      if (!snapshot) {
        Alert.alert('Error', 'Could not export image.');
        return;
      }
       const base64 = snapshot.encodeToBase64(ImageFormat.PNG, 100);

       const filePath = `${RNFS.CachesDirectoryPath}/erased-image-${Date.now()}.png`;
      await RNFS.writeFile(filePath, base64, 'base64');
        const imageUri = `file://${filePath}`;
       setImageUri(imageUri);
      
       navigation.pop(1) ;
      //  console.log(filePath);

      }
      catch(error){
          console.log(error);
          Alert.alert('Error', 'Failed to save image.');
      }
      


    }
  return (
    <View style={styles.container}>
         <Image source={require("../assets/bg_transparent.png")} style={styles.background}/>
      <Canvas
        ref={canvasRef}
        style={{
          width: canvasHeight,
          height: canvasHeight,
          backgroundColor: 'transparent',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <SkiaImage
          image={image}
          x={0}
          y={0}
          width={canvasWidth}
          height={canvasHeight}
          fit="fitWidth">
                                      <ColorMatrix matrix={imageFilterMatrix}/>
          
        </SkiaImage>

        {paths.map((item, index) => (
          <Path
            key={index}
            path={item.path}
            style="stroke"
            strokeWidth={item.size}
            strokeCap="round"
            strokeJoin="round"
            color="transparent"
            blendMode="clear"
          />
        ))}
      </Canvas>
      
       <View style={styles.bottomSheet}>
        <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>onCancelButtonPressed()}>
          <Entypo name='cross'  size={25}/>

        </TouchableOpacity>
       <View style={{padding:10,}}>
        <View style={{gap:10,}}>
            <Text style={styles.title}>Size</Text>
            <View style={{flexDirection:"row"}}>
                <Slider
                  style={{width:300}} value={10}
                  thumbSize={20}
                minimumTrackTintColor='#3478C5'
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  onValueChange={(val) => setEraserSize(val)} 
                />
                  <View style={{
                    outlineColor:'#7d7f7c',
                    borderWidth:1,
                    padding:0,
                    borderRadius:10,
                    width:40,
                    height:40,
                    justifyContent: "center", }}>
                    <Text style={{textAlign:"center",alignSelf:"center"}}>{eraserSize}</Text>

                  </View>
            </View>
        </View>
       
      </View>
       <View style={{ flexDirection: 'row',gap: 20,justifyContent: 'center',marginTop: 'auto',marginBottom: 30,}}> 
          <TouchableOpacity style={[styles.cancelButton,paths.length<=0&&{opacity:0.7}]} 
                 disabled={paths.length<=0} onPress={()=>onDiscardTapped()}>
                 <Text style={{  fontSize:17,
                        color:"#ffff",
                        fontWeight:"500",
                        alignSelf:"center",
                        textAlign: 'center',}}>Discard</Text>
                
             </TouchableOpacity>
             <TouchableOpacity style={[styles.saveButton,paths.length<=0&&{opacity:0.7}]}  
                      disabled={paths.length<=0} onPress={()=>onSaveTapped()}>
                 <Text style={{  fontSize:17,
                        color:"#ffff",
                        fontWeight:"500",
                        alignSelf:"center",
                        textAlign: 'center',}}>Done</Text>
                
             </TouchableOpacity>
        </View> 
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 'auto'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
   title:{
    fontWeight:"500",
    fontSize:20
  },
    background: {
     
    width: width,
        height:width,
    justifyContent: 'center', // Center the child image
    alignItems: 'center',
    position: 'absolute'
  },
  cancelButton:{
      backgroundColor:"#a3a5a2",
      padding:15,
      borderRadius:10,
      width:150
  },
  saveButton:{  backgroundColor:"#3478C5",padding:15,borderRadius:10,width:150},
    bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    elevation: 10,
    height:270,
    borderTopStartRadius:20,
    borderTopEndRadius:20,
  },
});