import Slider from "@react-native-community/slider";
import { size } from "@shopify/react-native-skia";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, View,Text, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Button from "./PrimaryButton";

type AdjustmentViewProps={
    onCancelButtonPressed:()=>void,
    onSaveButtonPressed:()=>void,
    saturation:number,
    setSaturation:Dispatch<SetStateAction<number>>,
    contrast:number,
    setContrast:Dispatch<SetStateAction<number>>,
    brightness:number,
    setBrightness: Dispatch<SetStateAction<number>>,
    setActiveAdjustment:Dispatch<SetStateAction<'brightness' | 'contrast' | 'saturation' | null>>,
    
   
}
export function AdjustmentView(adjustmentViewProps:AdjustmentViewProps){
    const onSetBrightness=(brightness:number)=>{
       adjustmentViewProps.setActiveAdjustment('brightness');
       adjustmentViewProps.setBrightness(brightness)
   }
       
    const onSetContrast=(contrast:number)=>{
       adjustmentViewProps.setActiveAdjustment('contrast');
       adjustmentViewProps.setContrast(contrast)
   }
   const onSetSaturation=(saturation:number)=>{
       adjustmentViewProps.setActiveAdjustment('saturation');
       adjustmentViewProps.setSaturation(saturation)
   }
 
    return(<View style={styles.conatiner}>
           {/* <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>adjustmentViewProps.onCancelButtonPressed()}>
                       <Entypo name='cross'  size={25}/>       
                    </TouchableOpacity> */}
                        <View style={{flexDirection:"row",gap:0}}>
                            <View style={{gap:10,alignItems:"center",width:70}}>
                                <Entypo name='light-up'  size={25}/>       
                                <Text style={{fontWeight:"400"}}>Brigtness</Text>
                            </View>    
                            <Slider style={{width:300}} value={adjustmentViewProps.brightness} onValueChange={(val)=>onSetBrightness(val)}
                                    thumbSize={20} minimumTrackTintColor='#3478C5'
                                    minimumValue={-50} maximumValue={50} step={1}/>
                        
                        </View>
                        <View style={{flexDirection:"row",gap:0}}>
                            <View style={{gap:10,alignItems:"center",width:70}}>
                                <FontAwesome5 name='adjust'  size={17}/>       
                                <Text style={{fontWeight:"400"}}>Contrast</Text>
                            </View>    
                                <Slider style={{width:300}} onValueChange={(val)=>onSetContrast(val)} 
                                        value={adjustmentViewProps.contrast} thumbSize={20} minimumTrackTintColor='#3478C5'
                                        minimumValue={-30} maximumValue={30} step={1}/>
                        </View>
                        <View style={{flexDirection:"row",gap:0}}>
                            <View style={{gap:10,alignItems:"center",width:70}}>
                                <Image source={require("../assets/offset.png")}   style={{height:30,width:30}}/>             
                                <Text style={{fontWeight:"400"}}>Saturation</Text>
                            </View>    
                                <Slider style={{width:300}} value={adjustmentViewProps.saturation} thumbSize={20}
                                  onValueChange={(val)=>onSetSaturation(val)} minimumTrackTintColor='#3478C5'
                                  minimumValue={-100} maximumValue={100} step={1}/>
                        </View>
                        {/* <Button title="Save" onClick={()=>adjustmentViewProps.onSaveContrast()}/> */}
                          <View style={{flexDirection:"row",justifyContent: 'space-between',}}>
                                     <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>adjustmentViewProps.onCancelButtonPressed()}>
                                            <Entypo name='cross'  size={25}/>       
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>adjustmentViewProps.onSaveButtonPressed()}>
                                            <Entypo name='check'  size={25}/>       
                                        </TouchableOpacity>
                                  </View>
    </View>);
}
const styles = StyleSheet.create({
          conatiner:{
              flex:1,
              paddingLeft:20,
              paddingRight:20,
              paddingTop:20,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              gap:20,
              elevation: 10,
              height:300,
              borderTopStartRadius:20,
              borderTopEndRadius:20,
          }
    });