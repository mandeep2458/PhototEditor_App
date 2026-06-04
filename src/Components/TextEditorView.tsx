import { Dispatch, SetStateAction } from "react";
import { FlatList, StyleSheet, TextInput, View ,Text, TouchableOpacity, ScrollView, Touchable, useWindowDimensions, KeyboardAvoidingView, Platform} from "react-native";
import Button from "./PrimaryButton";
import Entypo from "react-native-vector-icons/Entypo";
import Slider from "@react-native-community/slider";

type TextEditorProps={
    text:TextItem,
    fontFaimly:string|undefined,
    setFont:Dispatch<SetStateAction<string|undefined>>,
    fontSize:number,
    setFontSize:Dispatch<SetStateAction<number>>,
    textColor:string,
    setTextColor:Dispatch<SetStateAction<string>>,
    setText:Dispatch<SetStateAction<TextItem>>,
    onSave:()=>void,
    onCancel:()=>void,
    onDiscard:()=>void,
}
export function TextEditorView(textEditorProps:TextEditorProps){
     const { height } = useWindowDimensions();

   const fontFamilies = [
        {
            id: '1',
            name: 'Default',
            fontFamily: 'sans-serif',
        },
        {
            id: '2',
            name: 'Serif',
            fontFamily: 'serif',
        },
        {
            id: '3',
            name: 'Mono',
            fontFamily: 'monospace',
        },
        {
            id: '4',
            name: 'Light',
            fontFamily: 'sans-serif-light',
        },
        {
            id: '5',
            name: 'Medium',
            fontFamily: 'sans-serif-medium',
        },
        {
            id: '6',
            name: 'Condensed',
            fontFamily: 'sans-serif-condensed',
        },
        {
            id: '7',
            name: 'Thin',
            fontFamily: 'sans-serif-thin',
        },
   ];
        const colors=[
            {
            id:"red",
            color:"red"
            },
            {
                id:"blue",
                color:"blue"
            },
            {
                id:"pink",
                color:"pink"
            },
            {
                id:"orange",
                color:"orange"
            },
            {
               id:"yellow",
                color:"yellow"
            },
            {
               id:"purple",
               color:"purple"
            },
            {
              id:"black",
               color:"black"
            }];
        const onSelectFont=(item:{id:string,name:string,fontFamily:string|undefined})=>{
           
            textEditorProps.text.fontFaimly=item.fontFamily;
            textEditorProps.setFont(item.fontFamily);
        }
        const handleFontSize=(fontSize:number)=>{
                textEditorProps.setFontSize(fontSize)
                textEditorProps.text.fontSize=fontSize;
        }
        const onSelectColor=(selectedColor:{id:string,color:string})=>{
         
            textEditorProps.setTextColor(selectedColor.color);
            textEditorProps.text.color=selectedColor.color;
        }
        return(<KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
                   <View style={{flexDirection:"row",justifyContent: 'space-between',}}>
                                 <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>textEditorProps.onCancel()}>
                                        <Entypo name='cross'  size={25}/>       
                                    </TouchableOpacity>
                    </View>
                    <TextInput  value={textEditorProps.text.text} onChangeText={(value)=>textEditorProps.setText({...textEditorProps.text,text:value})}
                            style={styles.textBox}  multiline/>
                               <FlatList horizontal={true}   showsHorizontalScrollIndicator={false}  data={fontFamilies}
                           renderItem={({item})=>(
                            <TouchableOpacity style={styles.fontItemCard}  onPressOut={()=>onSelectFont(item)}>
                                <Text style={{fontFamily:item.fontFamily}} >{item.name}</Text>
                            </TouchableOpacity>)}/>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                              {
                                colors.map((item)=>(
                                    <TouchableOpacity key={item.id} onPress={()=>onSelectColor(item)}>
                                            <View  style={{backgroundColor:item.color,height:40,width:40,marginRight:10,borderRadius:40}}/>

                                    </TouchableOpacity>  
                                ))
                              }
                              </ScrollView>
                             <View style={{flexDirection:"row"}}>
                                            <Slider
                                              style={{width:300}} value={ textEditorProps.text.fontSize}
                                              thumbSize={20} 
                                            minimumTrackTintColor='#3478C5'
                                              minimumValue={1}
                                              maximumValue={100}
                                              step={1}
                                              onValueChange={(val) => handleFontSize(val)} />
                                              <View style={{
                                                outlineColor:'#7d7f7c',
                                                borderWidth:1,
                                                padding:0,
                                                borderRadius:10,
                                                width:40,
                                                height:40,
                                                justifyContent: "center", }}>
                                                <Text style={{textAlign:"center",alignSelf:"center"}}>{textEditorProps.fontSize}</Text>
                            
                                              </View>
                                        </View>
                            <View style={{flex: 1,justifyContent: 'flex-end',flexDirection: 'row',gap: 20,alignSelf:"center"}}>
                                
                                    <TouchableOpacity style={styles.cancelButton}  onPress={()=>textEditorProps.onDiscard()}>
                                                    <Text style={{  fontSize:17,
                                                            color:"#ffff",
                                                            fontWeight:"500",
                                                            alignSelf:"center",
                                                            textAlign: 'center',}}>Discard</Text>
                        
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.saveButton} onPress={()=>textEditorProps.onSave()}>
                                        <Text style={{  fontSize:17,
                                                color:"#ffff",
                                                fontWeight:"500",
                                                alignSelf:"center",
                                                textAlign: 'center',}}>Done</Text>
                                        
                                    </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>);

                }
 const styles = StyleSheet.create({
    container:{
              flex:1,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              gap:20,
              elevation: 10,
              borderTopStartRadius:20,
              borderTopEndRadius:20,
              padding:20
    },
    fontItemCard:{
        borderColor:"#ccc",
        padding:10,
        borderWidth:1, 
        borderRadius:10,
        height:40,
        margin:5
    },
    textBox: {
        height: 100, 
        color: '#000000' ,
        fontSize: 17,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textAlignVertical: 'top', // Critical for Android alignment
        fontWeight:"400",
        borderRadius:10
  },
  cancelButton:{
      backgroundColor:"#a3a5a2",
      borderRadius:50,
      paddingLeft:50,
      paddingRight:50,
      justifyContent:"center",
      height:50
  },
  saveButton:{
    backgroundColor:"#3478C5",
    borderRadius:50,
    paddingLeft:50,
      paddingRight:50,
      justifyContent:"center",
            height:50

},

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
    borderRadius:40
  },
 })