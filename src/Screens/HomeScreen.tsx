import { View ,Text, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, ActivityIndicator, Alert} from "react-native";
import PrimaryButton from "../Components/PrimaryButton";
import { CameraOptions, launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Routes/RootStackParamList";
import { useState } from "react";
import { pickAndConvertToPng } from "../ImageConverter/PngConverter";
import { UseImageContext } from "../Context/ImageContext";

export function HomeScreen(){
  const {setImageUri}=UseImageContext();
   const [isloading,setLoading]=useState(false);
     const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList,'Home'>>();
      const options:CameraOptions = {
          mediaType: 'photo',
          quality: 1,
        };

      const captureImageFromCamera=async()=>{
             if (Platform.OS === 'android') {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
              );

              if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                
                Alert.alert('Permission Required', 'Please allow camera permission.');
                return;
              }
           }

        
   
        const result = await launchCamera(options);
          if (result.didCancel) {
            return;
          }
           if (result.errorCode) {
            Alert.alert('Camera Error', result.errorMessage || 'Something went wrong');
            return;
          }

            const imageUri=result.assets?.[0]?.uri;
            if(imageUri){
              setImageUri(imageUri);
              navigation.navigate('PhotoPreview');             
            }
      }
        const pickImageFromGallery=async()=>{
             setLoading(true);

          try{
               if (Platform.OS === 'android') {
                const permission =
                Platform.Version >= 33
                  ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                  : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
              console.log(Platform.Version)
              const granted = await PermissionsAndroid.request(permission);
               

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                  Alert.alert('Permission required', 'Please allow photo permission.');
                  
                  return;
                }
              }
           
            const imageUri=await pickAndConvertToPng();
              if(imageUri){
                 setImageUri(imageUri);
                 navigation.navigate('PhotoPreview');

              }
                
                
             
          }
          catch(error){
                 console.log('pickImageFromGallery error:', error);
          }finally{
            setLoading(false);
          }
        
      }
    return (<View style={styles.container}>
        <View style={{gap:10}}>
            <Text style={styles.title}>Photo Editor</Text>
            <Text>Edit your photos easily</Text>
        </View>
      <View style={{gap:10}}>
            <PrimaryButton buttonImage="camera" title="Take Photo" onClick={()=>captureImageFromCamera()}/>
            <PrimaryButton buttonImage="photo" title="Choose from Gallery" onClick={()=>pickImageFromGallery()}/>
      </View>
      {isloading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#3478C5" />
            </View>
          )}
       
    </View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:"center",
    justifyContent: 'center' ,
    gap:20
  },
  title:{
    fontWeight:"500",
    fontSize:25
  }, overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensures it stays on top
  },

});
