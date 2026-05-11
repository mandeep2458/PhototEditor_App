import { Blur, Canvas,ColorMatrix,Image, useImage } from "@shopify/react-native-skia";
import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FilterOptionCardProps={
    id:string,
    title:string,
    image:string,
    matrix:number[],
    isSelected:boolean,
    onSelectFilter:()=>void;
}
export function FilterOptionCard(filterCardOptions:FilterOptionCardProps){

     const image = useImage( filterCardOptions.image);
    return(
        <TouchableOpacity onPress={()=>filterCardOptions.onSelectFilter()} style={styles.filterOptionCard}>
           
           <View style={[{height:70,padding:2},filterCardOptions.isSelected&&{borderWidth:2}]}>
             <Canvas style={{ flex: 1 ,width:70,padding:20}}>
                   <Image x={0} y={0} width={70} height={70} image={image} fit="cover" >
                    <ColorMatrix matrix={filterCardOptions.matrix}/>
                </Image>
            </Canvas>
            </View>
            <Text style={{fontWeight:"500",alignSelf:"center",flex:1}}>{filterCardOptions.title}</Text>
           
        </TouchableOpacity>
    );
}
    const styles = StyleSheet.create({ 
        filterOptionCard:{alignContent:"center",gap:10}
    })