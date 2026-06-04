import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Routes/RootStackParamList";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, 
        Image as RNImage, ScrollView, Dimensions,
        Platform, PermissionsAndroid, Alert } from "react-native";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { removeBackground } from '@six33/react-native-bg-removal';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import Lucide from "@react-native-vector-icons/lucide";
import { UseImageContext } from "../Context/ImageContext";
import ImagePicker from 'react-native-image-crop-picker';
import { ColorFilterOptions } from "../Components/ColorFilterOptions";
import { Canvas, ColorMatrix, convertToAffineMatrix, Image as SkiaImage, useCanvasRef, useImage, } from "@shopify/react-native-skia";
import { AdjustmentView } from "../Components/AdjustmentView";
import { TopBar } from "../Components/TopBar";
import { TextEditorView } from "../Components/TextEditorView";
import { DragTextEditor as OriginalDragTextEditor } from "react-native-drag-text-editor";
import { DraggableText } from "../Components/DraggableText";
import { launchImageLibrary } from "react-native-image-picker";
import { DraggableOverlayImage } from "../Components/DraggableOverlayImage";
import Slider from "@react-native-community/slider";
import ViewShot, { captureRef } from 'react-native-view-shot'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
// Force TypeScript to treat it as an un-typed component
const DragTextEditor = OriginalDragTextEditor as any;
type ProductDetailsPropsType=NativeStackScreenProps<RootStackParamList,'PhotoPreview'>;

export function PhotoPreviewScreen({navigation}:ProductDetailsPropsType){
      // const [imageURI,setImageURI]=useState("");
      const [isLoading,setIsLoading]=useState(false);
      const [undoStack,setUndoStack]=useState<EditorState[]>([]);
      const [redoStack,setRedoStack]=useState<EditorState[]>([]);
      const [textValue,setTextValue]=useState<TextItem>({ id: "",
  text: "",
  x: 0,
  y: 0,
  color: "",
  fontSize: 20,
  fontFaimly:undefined,});
        const [isExporting, setIsExporting] = useState<boolean>(false);

      const [textItems,setTextItems]=useState<TextItem[]>([]);
            const [selectedFont, setSelectedFont] = useState<string|undefined>(undefined);

      const [overlayImages, setOverlayImages] = useState<OverlayImageItem[]>([]);
      const [selectedImage,setSelectedImage]=useState<OverlayImageItem|undefined>(undefined);
       const [isSaving, setIsSaving] = useState(false);
      const [exportBaseImageUri, setExportBaseImageUri] = useState<string | null>(
        null
      );
      const exportImageLoadedResolver = useRef<(() => void) | null>(null);    
      const [fontSize, setFontSize] = useState<number>(20);
      const [textColor,setTextColor]=useState<string>("#000");
      const [filterOptionsAppeared,setfilterOptionsAppeared]=useState(false);
      const [adjustmentViewAppeared,setAdjustmentViewAppeared]=useState(false);
      const[editTextMode,setEditTextMode]=useState(false);
      const[isBaseImageSelected,setBaseImageSelected]=useState(false);
      const {imageUri,setImageUri,imageFilterMatrix,setImageFilterColorMatrix,selectedFilterId}=UseImageContext();
      
      const { width, height } = Dimensions.get('window');
      const [imageWidth,setImageWidth]=useState(width)
        const[editorState,setEditorState]=useState<EditorState>({
        imageUri:imageUri,
       adjustmentMatrix:[],     
        filter:imageFilterMatrix,
        texts:[],
        overLAyImages:[]
      });
        const viewShotRef = useRef<any>(null);
        const skiaCanvasRef = useCanvasRef();

        const image = useImage(imageUri);
        const onRedoTapped=()=>{
          setRedoStack(prevRedo => {
              if (prevRedo.length === 0) return prevRedo;
              
              const previousState = prevRedo[0];

              setUndoStack(prevUno => [...prevUno,editorState]);
              setEditorState(previousState);
              setImageUri(previousState.imageUri);
              setImageFilterColorMatrix(previousState.filter,selectedFilterId)
              setAdjustmentMatrix(previousState.adjustmentMatrix)
              setTextItems(previousState.texts)
              setOverlayImages(previousState.overLAyImages);
              return prevRedo.slice(1);
            });
      }
       // 2. Request runtime permission on Android devices

      const requestAndroidPermission = async () => {
        if (Platform.OS !== 'android') {
          return true;
        }

        const androidVersion = Number(Platform.Version);

        try {
          // Android 13+
          if (androidVersion >= 33) {
            const result = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
              PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            ]);

            return (
              result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
                PermissionsAndroid.RESULTS.GRANTED ||
              result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
                PermissionsAndroid.RESULTS.GRANTED
            );
          }

          // Android 10 to Android 12
          if (androidVersion >= 29) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );

            return granted === PermissionsAndroid.RESULTS.GRANTED;
          }

          // Android 9 and below
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );

          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
          console.log('Permission error:', error);
          return false;
        }
      };
      const prepareBaseImageForExport = async () => {
      const snapshot = skiaCanvasRef.current?.makeImageSnapshot();

      if (!snapshot) {
        return null;
      }

      const base64 = snapshot.encodeToBase64();

      return `data:image/png;base64,${base64}`;
    };
    const waitForExportImageToLoad = () => {
      return new Promise<void>(resolve => {
        exportImageLoadedResolver.current = resolve;
      });
    };
      const onDownloadTapped=async()=>{
        try{
           const hasPermission = await requestAndroidPermission();
            if (!hasPermission) {
              Alert.alert('Permission Denied', 'Cannot save image without storage storage access.');
              return;
            }
          
      
       const baseImageUri = await prepareBaseImageForExport();

        if (!baseImageUri) {
          return;
        }
          setExportBaseImageUri(baseImageUri);
          setIsExporting(true);
             await waitForExportImageToLoad();

               await new Promise(resolve => requestAnimationFrame(resolve));
               setTimeout(async () => {
                const localUri=await viewShotRef.current.capture?.();
            
                setIsExporting(false);
                setExportBaseImageUri(null);
                setIsSaving(false);

                if (!localUri) {
                  return;
                }
                await CameraRoll.saveAsset(localUri, { type: 'photo' });
                Alert.alert('Success', 'Screen content successfully saved to your gallery!');
           }, 300);
        }
        catch(error){
            Alert.alert('Error', 'An error occurred while generating the image.');
        }
      }
      const onUndoTapped=()=>{
       setUndoStack(prevUndo => {
            if (prevUndo.length === 0) return prevUndo;

            const previousState = prevUndo[prevUndo.length - 1];

            setRedoStack(prevRedo => [editorState, ...prevRedo]);
            setEditorState(previousState);
            setImageUri(previousState.imageUri);
            setImageFilterColorMatrix(previousState.filter,selectedFilterId)
            setAdjustmentMatrix(previousState.adjustmentMatrix)
            setTextItems(previousState.texts)
            setOverlayImages(previousState.overLAyImages);
            return prevUndo.slice(0, -1);
          });
      }
      const updateEditorState = (newState: EditorState) => {
          setUndoStack(prev => [...prev, editorState]);
          setEditorState(newState);
          setRedoStack([]);
        };
     
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
          updateEditorState({...editorState,imageUri:image.path});
        }
      }).catch((error)=>{
      
         console.log(error);
      });
      }
      const onColorFiltersTapped=()=>{
        setfilterOptionsAppeared(true)
      }
      const AddTextTapped=()=>{
        setEditTextMode(true);

      }
      const onResizeImageTapped=()=>{
        setSelectedImage({id:"",uri:imageUri,x:0,y:0,isSelected:true,width:width,height:400});
      }
      const AddImageTapped=async ()=>{
           const result = await launchImageLibrary({
                 mediaType: 'photo',
                 selectionLimit: 1,
               });
         
               if (result.didCancel) return;
         
               const asset = result.assets?.[0];
         
               if (!asset?.uri) return;

               const overlayImageItem={
                id:Date.now().toString(),
                uri:asset.uri,
                x:0,
                y:0,
                height:70,
                width:70,
                isSelected:false,
               }
              setOverlayImages(prev=>{
                const updatedImages=[overlayImageItem,...prev];
                updateEditorState({...editorState,overLAyImages:updatedImages});
                return updatedImages;
              })
            }

      const onAdjustTapped=()=>{
        setAdjustmentViewAppeared(true);
      }
      const onSelectImage=(id:string)=>{
         setOverlayImages(prev=>prev.map(item=>item.id==id?{...item,isSelected:true}:{...item,isSelected:false}));
      }
      const handleSelectedImageEdit=(overlayImageItem:OverlayImageItem)=>{
           setSelectedImage(overlayImageItem);

      }
      const onSelectedImageDelete=(id:string)=>{
         setOverlayImages(prev=>prev.filter((image)=>image.id!==id));

      }
      const onCancelImageResize=()=>{
        
        unSelectSelectedImage();
    
      }
      const onSaveImageResize=()=>{
           unSelectSelectedImage();

      }
      const unSelectSelectedImage=()=>{
       setSelectedImage(undefined);
           setOverlayImages(prev=>prev.map(overlayImage=>{
          return {...overlayImage,isSelected:false}
         }));
      }
      const onRemoveBgTapped=async()=>{
         try {
          setIsLoading(true);
            // By default, the library trims transparent pixels from the output
            const resultURI = await removeBackground(imageUri,{ trim: false });
            //  setImageURI(resultURI);
             setImageUri(resultURI);
             updateEditorState({...editorState,imageUri:resultURI});
           
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
      const [adjustmentMatrix,setAdjustmentMatrix]=useState(imageFilterMatrix);

      useEffect(()=>{
        setAdjustmentMatrix(getAdjustmentMatrix());
      },[brightness,contrast,saturation]);
      const getAdjustmentMatrix = () => {
        switch (activeAdjustment) {
          case 'brightness': {
            const offset = brightness / 100;

            return [
              1, 0, 0, 0, offset,
              0, 1, 0, 0, offset,
              0, 0, 1, 0, offset,
              0, 0, 0, 1, 0,
            ];
          }

          case 'contrast': {
            const value = 1 + contrast / 100;

            return [
              value, 0,     0,     0, 0,
              0,     value, 0,     0, 0,
              0,     0,     value, 0, 0,
              0,     0,     0,     1, 0,
            ];
          }

          case 'saturation': {
            const value = 1 + saturation / 100;

            return [
              0.213 + 0.787 * value, 0.715 - 0.715 * value, 0.072 - 0.072 * value, 0, 0,
              0.213 - 0.213 * value, 0.715 + 0.285 * value, 0.072 - 0.072 * value, 0, 0,
              0.213 - 0.213 * value, 0.715 - 0.715 * value, 0.072 + 0.928 * value, 0, 0,
              0, 0, 0, 1, 0,
            ];
          }

          default:
            return imageFilterMatrix;
        }
      };
      const onSaveFilterTapped=()=>{
        updateEditorState({...editorState,filter:imageFilterMatrix});
         setfilterOptionsAppeared(false);
      }
      const onCancelButtonTapped=()=>{
          setfilterOptionsAppeared(false);
      }
      const onSaveAdjustment=()=>{      
         updateEditorState({...editorState,adjustmentMatrix:adjustmentMatrix});            
         setAdjustmentViewAppeared(false);
      }
      const onTextSave=()=>{
          const newText:TextItem={
                id: Date.now().toString(),
                text: textValue.text,
                x: 0,
                y: 0,
                color: textValue.color,
                fontSize: textValue.fontSize,
              fontFaimly:selectedFont}
        updateEditorState({...editorState,texts:[...textItems,newText]});
         setTextItems([...textItems,newText]);
         setTextValue({...textValue,text:""});
         setEditTextMode(false);
      }
      const updateOverlayImageSize=(id:string,size:number)=>{
        if(id)
          setOverlayImages(prev=>prev.map(image=>image.id==id?{...image,height:size,width:size}:image))
        else
          setImageWidth(size);
      }
      
      const onDiscardText=()=>{
      
        setTextValue({...textValue,text:""});

      }
       const onCancelAdjustment=()=>{                  
         setAdjustmentViewAppeared(false);
      }
      const onCancelTextEditor=()=>{
          setEditTextMode(false);
      }
      const onBaseImageSelected=()=>{
        unSelectSelectedImage();
        setBaseImageSelected(true);
      }
      return (<View style={styles.container}>
              <TopBar onCancel={()=>{
                navigation.pop();
              }} onSave={()=>{}} onUndo={onUndoTapped} onRedo={onRedoTapped} onDownload={onDownloadTapped}/>
                
                  <View  style={styles.photoContainer}>
                    <ViewShot
                      ref={viewShotRef}
                      options={{
                        format: 'png',
                        quality: 1,
                      }}   style={styles.viewShot}>
                        <TouchableOpacity onPress={onBaseImageSelected}>
                              {/* <RNImage source={require("../assets/bg_transparent.png")} style={styles.background}/> */}
                              
                              
                                 {isExporting && exportBaseImageUri ? (
                                  <RNImage
                                    source={{ uri: exportBaseImageUri }}
                                    style={styles.baseImage}
                                    resizeMode="contain"
                                      onLoad={() => {
                                        exportImageLoadedResolver.current?.();
                                        exportImageLoadedResolver.current = null;
                                      }}
                                      onError={() => {
                                        exportImageLoadedResolver.current?.();
                                        exportImageLoadedResolver.current = null;
                                      }}
                                  />
                                ) :( 
                                  
                                    <Canvas     ref={skiaCanvasRef} style={{ width: '100%', height: 400 }}>
                                          <SkiaImage
                                            x={0}
                                            y={0}
                                            width={imageWidth}
                                            height={400 }
                                            image={image}
                                            fit="contain" >
                                              <ColorMatrix matrix={imageFilterMatrix} />
                                              <ColorMatrix matrix={adjustmentMatrix}/>
                                          </SkiaImage>
                                  </Canvas>
                                  // <RNImage source={{uri:imageUri}} width={imageWidth} height={400 }/>
                                )
                              }
                              {
                                overlayImages.map((item)=>(

                                  <DraggableOverlayImage key={item.id} item={item} onDelete={()=>onSelectedImageDelete(item.id)}
                                  onSelect={()=>onSelectImage(item.id)} onEdit={()=>handleSelectedImageEdit(item)} onPositionChange={()=>{}}/>
                                ))
                              }
                              {
                              textValue&&
                                (
                                  <View style={styles.textOverLay}>
                                    <Text style={[styles.text,textValue.fontFaimly&&
                                    {
                                      fontFamily:textValue.fontFaimly
                                    },
                                      {
                                        fontSize:fontSize,
                                        color:textColor
                                        }]}>{textValue.text}</Text>
                                  </View>
                                )
                              }
                              {
                                textItems.map((item)=>(   
                                <DraggableText
                                  key={item.id}
                                  item={item}
                                  onPositionChange={(id, x, y) => {}}/>
                                
                                ))
                              }
                                
                              {isLoading && (
                              <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                              
                              </View>
                            )}
                        </TouchableOpacity>
                   </ViewShot>
                  </View>
                  <View style={{alignContent:"flex-end",marginRight: 10,padding: 10,borderRadius: 25,
                        backgroundColor: '#fff',flexDirection:"row",marginTop: 'auto',marginBottom: 10}}>
                         <ScrollView horizontal={true}  contentContainerStyle={{ columnGap: 20,paddingLeft:20 }} >
                            
                            <TouchableOpacity  onPress={onCropImageTapped} style={{gap:10}} disabled={isLoading}>
                                <Entypo name="crop" size={30} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Crop</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={onColorFiltersTapped} style={{gap:10,}} disabled={isLoading}>
                                <Ionicons name="color-filter-outline" size={30} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Color Filters</Text>
                            </TouchableOpacity>
                              <TouchableOpacity  onPress={onResizeImageTapped} style={{gap:10,}} disabled={isLoading}>
                                <Fontisto name="arrow-resize" size={30} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Resize</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={AddTextTapped} style={{gap:10,}} disabled={isLoading}>
                                <Fontisto name="font" size={23} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Text</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={AddImageTapped} style={{gap:10,}} disabled={isLoading}>
                                 <Lucide name="images" size={30} style={styles.bottomIcons}/>
                                 <Text style={styles.bottomTextOptions}>Add Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={onAdjustTapped} style={{gap:10,}} disabled={isLoading}>
                                  <Entypo name="adjust" size={30} style={styles.bottomIcons}/>
                                  <Text style={styles.bottomTextOptions}>Adjust</Text>
                            </TouchableOpacity>
                          <TouchableOpacity  onPress={onRemoveBgTapped} style={{gap:10}} disabled={isLoading}>
                              <RNImage source={require("../assets/bg_remover.png")} style={styles.bottomIcons}/>
                              <Text style={styles.bottomTextOptions}>BG Remover</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{gap:10}} onPress={onEraserTapped}>
                                <Lucide name="eraser" size={30} style={styles.bottomIcons}/>
                                <Text style={styles.bottomTextOptions}>Pixel Remover</Text>
                            </TouchableOpacity>
                         </ScrollView>
                         
                  </View>
                  {
                    filterOptionsAppeared && <ColorFilterOptions  onSaveButtonPressed={()=>onSaveFilterTapped()}
                    onCancelButtonPressed={()=>onCancelButtonTapped()}/>
                   
                  }
                  {
                    adjustmentViewAppeared && <AdjustmentView onCancelButtonPressed={()=>onCancelAdjustment()} brightness={brightness} contrast={contrast} 
                      saturation={saturation}  setSaturation={setSaturation}  onSaveButtonPressed={()=>onSaveAdjustment()}
                      setBrightness={setBrightness} setContrast={setContrast} setActiveAdjustment={setActiveAdjustment}/>
                  }
                  {
                    editTextMode&&<TextEditorView text={textValue} setText={setTextValue} setFont={setSelectedFont}
                        onCancel={()=>onCancelTextEditor()} fontFaimly={textValue.fontFaimly} textColor={textColor} setTextColor={setTextColor} fontSize={textValue.fontSize}
                        setFontSize={setFontSize} onSave={()=>onTextSave()} onDiscard={()=>onDiscardText()} />
                  }
                   {selectedImage && (
                    <View
                      style={{
                         flex:1,
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          gap:20,
                          elevation: 10,
                          borderTopStartRadius:20,
                          borderTopEndRadius:20,
                          padding:20,
                          backgroundColor: '#111',
                      }}
                    >
                       <View style={{flexDirection:"row",justifyContent: 'space-between',}}>
                                   <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={onCancelImageResize}>
                                          <Entypo name='cross'  size={25} color="#ffff"/>       
                                      </TouchableOpacity>
                                      <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={onSaveImageResize}>
                                          <Entypo name='check'  size={25} color="#ffff"/>       
                                      </TouchableOpacity>
                                </View>
                      <Text style={{ color: '#fff', marginBottom: 8 }}>
                        Resize Image
                      </Text>

                      <Slider
                        minimumValue={60}
                        maximumValue={width}
                        value={selectedImage.width}
                        step={1} thumbSize={20}
                        minimumTrackTintColor="#3478C5"
                        maximumTrackTintColor="#555"
                        onValueChange={value => {
                          updateOverlayImageSize(selectedImage.id, value);
                        }}/>
                    </View>
                  )}
              
                 
            </View>)
        }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems:"center",
        justifyContent: 'center' ,
       
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
  textOverLay:{  
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      alignSelf:"center",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      },
      text:{
        fontWeight:"400",
        fontSize:20
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
      textBox: {
        position: 'absolute',
        top: 160,
        left: 60,

        minWidth: 160,
        minHeight: 45,

        color: '#000',
        fontSize: 20,
        fontWeight: '700',

        borderWidth: 1,
        borderColor: 'transparent',
        borderRadius: 8,

        paddingHorizontal: 10,
        paddingVertical: 6,
        borderBottomWidth: 0,
        textDecorationLine: 'none',
        
  },
   viewShot: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  
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
  textEditor:{ 
    justifyContent: 'center',
    alignItems: 'center',
    position:"absolute"
  },
loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
   baseImage: {
    width: '100%',
    height: 400,
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