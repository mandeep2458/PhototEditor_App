import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Routes/RootStackParamList";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, Image as RNImage, ScrollView, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { removeBackground } from '@six33/react-native-bg-removal';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lucide from "@react-native-vector-icons/lucide";
import { UseImageContext } from "../Context/ImageContext";
import ImagePicker from 'react-native-image-crop-picker';
import { ColorFilterOptions } from "../Components/ColorFilterOptions";
import { Canvas, ColorMatrix, Image as SkiaImage, useImage, } from "@shopify/react-native-skia";
import { AdjustmentView } from "../Components/AdjustmentView";

type ProductDetailsPropsType=NativeStackScreenProps<RootStackParamList,'PhotoPreview'>;

export function PhotoPreviewScreen({navigation}:ProductDetailsPropsType){
     
      // const [imageURI,setImageURI]=useState("");
      const [isLoading,setIsLoading]=useState(false);
      const [filterOptionsAppeared,setfilterOptionsAppeared]=useState(false);
      const [adjustmentViewAppeared,setAdjustmentViewAppeared]=useState(false);
      const {imageUri,setImageUri,imageFilterMatrix}=UseImageContext();
           const image = useImage( imageUri);
      const { width, height } = Dimensions.get('window');
      let selectedFilterId ="original";
      
      const onCropImageTapped=()=>{
         ImagePicker.openCropper({
          mediaType:"photo",
          path: imageUri,
            width: 300,        // Resizes the final result to this width
            height: 400,       // Resizes the final result to this height
            cropping: true,     // Enables the UI cropping tool
            compressImageQuality: 0.8 // Optional: Compresses the result
      }).then(image => {
        if(image.path){
          setImageUri(image.path); // Use this path in an <Image /> component

        }
      }).catch((error)=>{
      
         console.log(error);
      });
      }
      const onColorFiltersTapped=()=>{
        setfilterOptionsAppeared(true)
      }
      const onAdjustTapped=()=>{
        setAdjustmentViewAppeared(true);
      }
      const onRemoveBgTapped=async()=>{
         try {
          setIsLoading(true);
            // By default, the library trims transparent pixels from the output
            const resultURI = await removeBackground(imageUri,{ trim: false });
            //  setImageURI(resultURI);
             setImageUri(resultURI);

            console.log('Processed Image URI:', resultURI);
            // return resultURI;
          } 
          catch (error:any) {
            console.error('Background removal failed:', error.message);
          }finally{
             setIsLoading(false);
          }
      }
     
      const onEraserTapped=async()=>{
          navigation.navigate('PixelEraser');
      }
      const [brightness, setBrightness] = useState(0);
      const [contrast, setContrast] = useState(0);
      const [saturation, setSaturation] = useState(0);
      const [activeAdjustment, setActiveAdjustment] = useState<'brightness' | 'contrast' | 'saturation' | null>(null);
      const getAdjustmentMatrix = () => {
          if (activeAdjustment === 'brightness') {
              const offset = brightness / 100;

            return [
              1, 0, 0, 0, offset,
              0, 1, 0, 0, offset,
              0, 0, 1, 0, offset,
              0, 0, 0, 1, 0,
            ];
          }

          if (activeAdjustment === 'contrast') {
            const value = 1 + contrast / 100;

            return [
              value, 0,     0,     0, 0,
              0,     value, 0,     0, 0,
              0,     0,     value, 0, 0,
              0,     0,     0,     1, 0,
            ];
          }

          if (activeAdjustment === 'saturation') {
            const value = 1 + saturation / 100;

            return [
              0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value, 0, 0,
              0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value, 0, 0,
              0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value, 0, 0,
              0, 0, 0, 1, 0,
            ];
          }

      return imageFilterMatrix;
    };
      return (<View style={styles.container}>
                  <View style={styles.photoContainer}>
                    <RNImage source={require("../assets/bg_transparent.png")} style={styles.background}/>
                    {
                     
                       imageUri&&( 
                        <Canvas style={{ width: '100%', height: 400 }}>
                          <SkiaImage
                            x={0}
                            y={0}
                            width={width}
                            height={400 }
                            image={image}
                            fit="contain" >
                            <ColorMatrix matrix={imageFilterMatrix} />
                            <ColorMatrix matrix={getAdjustmentMatrix()}/>
                          </SkiaImage>
                        </Canvas>
                       )
                    }
                     {isLoading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color="#fff" />
                    
                    </View>
                  )}
                  </View>
                  <View style={{alignContent:"flex-end",marginRight: 10,padding: 10,borderRadius: 25,
                        backgroundColor: '#fff',flexDirection:"row",marginTop: 'auto',marginBottom: 10}}>
                         <ScrollView horizontal={true}  contentContainerStyle={{ columnGap: 20,paddingLeft:20 }} >
                            
                            <TouchableOpacity  onPress={()=>onCropImageTapped()} style={{gap:10}} disabled={isLoading}>
                                <Entypo name="crop" size={30} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Crop</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>onColorFiltersTapped()} style={{gap:10,}} disabled={isLoading}>
                                <Ionicons name="color-filter-outline" size={30} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Color Filters</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>onAdjustTapped()} style={{gap:10,}} disabled={isLoading}>
                                  <Entypo name="adjust" size={30} style={styles.bottomIcons}/>
                                  <Text style={styles.bottomTextOptions}>Adjust</Text>
                            </TouchableOpacity>
                          <TouchableOpacity  onPress={()=>onRemoveBgTapped()} style={{gap:10}} disabled={isLoading}>
                              <RNImage source={require("../assets/bg_remover.png")} style={styles.bottomIcons}/>
                              <Text style={styles.bottomTextOptions}>BG Remover</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{gap:10}} onPress={()=>onEraserTapped()}>
                                <Lucide name="eraser" size={30} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Pixel Remover</Text>
                            </TouchableOpacity>
                         </ScrollView>
                         
                  </View>
                  {
                    filterOptionsAppeared && <ColorFilterOptions  imageUri={imageUri} onCancelButtonPressed={()=>{
                      setfilterOptionsAppeared(false);}}/>
                   
                  }
                  {
                    adjustmentViewAppeared && <AdjustmentView onCancelButtonPressed={()=>{
                      setAdjustmentViewAppeared(false);}} brightness={brightness} contrast={contrast} saturation={saturation}  setSaturation={setSaturation} 
                      setBrightness={setBrightness} setContrast={setContrast} setActiveAdjustment={setActiveAdjustment}/>
                  }
            </View>)
        }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems:"center",
        justifyContent: 'center' ,
        gap:20,
      },
       background: {
         width: '100%',
         height:400,
         justifyContent: 'center', // Center the child image
         alignItems: 'center',
         position: 'absolute'
       },
   overlay: {
    width: '100%',
        height:400,
  },
      photoContainer:{ 
        width: '100%',
        height:400,
        aspectRatio: 1,
        borderRadius: 10,
        backgroundColor: '#ffff',
        alignSelf:"center",
        verticalAlign:"middle",
        marginTop:"auto",
      
      },
      scanLine: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: 'rgba(255,255,255,0.25)',
        },

processingBox: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    imageBox: {
    width: '100%',
    height: 420,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIcons:{
    height:30,
    width:30,
    alignSelf:"center"
  },
   bottomTextOptions:{
    fontWeight:"500"
   }
   
  })