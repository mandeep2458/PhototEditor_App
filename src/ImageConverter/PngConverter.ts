import { Alert } from "react-native";
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { launchImageLibrary } from "react-native-image-picker";

export const pickAndConvertToPng = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel) return;

      const asset = result.assets?.[0];

      if (!asset?.uri) return;

      const convertedImage = await ImageResizer.createResizedImage(
        asset.uri,
        asset.width ?? 1000,
        asset.height ?? 1000,
        'PNG',
        100,
        0,
      );
      console.log(convertedImage);
      return convertedImage.uri;
    //   setImageUri(convertedImage.uri);
    } catch (error) {
      console.log('PNG conversion error:', error);
      Alert.alert('Error', 'Failed to convert image to PNG.');
      
    }
  };