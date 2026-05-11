import React from "react";
import { TouchableOpacity,StyleSheet, Text, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function Button({title,onClick,isDisabled=true,buttonImage}:{title:string;onClick:()=>void,isDisabled?:boolean,buttonImage?:string}){
  return (<TouchableOpacity style={[styles.buttonStyle,!isDisabled&&{opacity:0.7}]} disabled={!isDisabled} onPress={()=>onClick()}>
               <View style={{flexDirection:"row",gap:10,}}>
                  {
                     buttonImage&&
                 <MaterialIcons name={buttonImage} size={20} color="#fff" />

                  }
                <Text style={styles.buttonTextStyle}>{title}</Text>
               </View>
           
         </TouchableOpacity>);
}
export default Button;
const styles=StyleSheet.create({
     buttonStyle:{
        backgroundColor:"#3478C5",
        padding:15,
        borderRadius:50,
   }, 
   buttonTextStyle:{
      fontSize:17,
      color:"#ffff",
      fontWeight:"500",
      alignSelf:"center",
      textAlign: 'center',
      
   }
});