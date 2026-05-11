import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { FilterOptionCard } from "./FilterOptionCard";
import { 
  ColorMatrix, 
  concatColorMatrices, 
  sepia, 
  contrast, 
  saturate, 
  tint,vintage
} from 'react-native-color-matrix-image-filters';
import { UseImageContext } from "../Context/ImageContext";
import { useEffect, useState } from "react";
type ColorFilterOptionsProps={
    imageUri:string,
   
    onCancelButtonPressed:()=>void,
}
export function ColorFilterOptions(colorFilterOptionsProps:ColorFilterOptionsProps){
    const {setImageFilterColorMatrix,imageFilterMatrix,selectedFilterId}=UseImageContext();
    
    const [filters,setfilters] =useState( [
            { id: 'original', label: 'Original',matrix: [
                  1, 0, 0, 0, 0,
                  0, 1, 0, 0, 0,
                  0, 0, 1, 0, 0,
                  0, 0, 0, 1, 0,
                ],isSelected:false },
            { id: 'blackWhite', label: 'B&W',matrix:[
                  0.33, 0.33, 0.33, 0, 0,
                  0.33, 0.33, 0.33, 0, 0,
                  0.33, 0.33, 0.33, 0, 0,
                  0,    0,    0,    1, 0,
                ],isSelected:false },
            { id: 'sepia', label: 'Sepia',matrix:[
                  0.393, 0.769, 0.189, 0, 0,
                  0.349, 0.686, 0.168, 0, 0,
                  0.272, 0.534, 0.131, 0, 0,
                  0,     0,     0,     1, 0,
                ],isSelected:false },
          //  { id: 'neo', label: 'Neo',matrix:[
          //     0.78, 0.08, 0.04, 0, 0,
          //   0.05, 0.74, 0.05, 0, 0,
          //   0.04, 0.10, 0.76, 0, 0,
          //   0,    0,    0,    1, 0,
          //   ] },
          { id: 'neo', label: 'Neo',matrix:[
              -0.5, 1, 0.5, 0, 0,
                0.5, 0.5, 0, 0, 0,
                0, 1.5, -0.5, 0, 0,
                0, 0, 0, 1, 0,
            ],isSelected:false },
            { id: 'warm', label: 'Warm',matrix:[
                1.06, 0,    0,    0, 0,   // Red: slightly increased
                0,1.01, 0,0, 0,   // Green: slightly increased
                0,0,0.93,0,0,   // Blue: reduced
                0, 0, 0, 1, 0   
                ],isSelected:false },
            { id: 'cool', label: 'Cool',matrix:[
                1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1.5, 0, 0, // Boost Blue
            0, 0, 0, 1, 0
                ],isSelected:false },
            { id: 'blueDream', label: 'Blue Dream',matrix:[
                0.627, 0.320, 0.053, 0, 0.039,
                0.280, 0.590, 0.130, 0, 0.039,
                0.100, 0.300, 0.800, 0, 0.039,
                0,     0,     0,     1, 0
                    ],isSelected:false  },
          // { id: 'vintage', label: 'Vintage',matrix:concatColorMatrices(
          //     sepia(0.85),    // Adds warm, aged tone
          //     contrast(1.2), // Makes colors pop slightly more
          //     saturate(0.7)  // Dulls the colors for an older look
          //   ),isSelected:false  },
           { id: 'vintage', label: 'Vintage',matrix:[
                0.627, 0.320, -0.039, 0, 0.037,
                0.025, 0.644, 0.054, 0, 0.029,
                -0.039, -0.039, 0.541, 0, 0.022,
                 0, 0, 0, 1, 0
              ],isSelected:false  },
            { id: 'highContrast', label: 'Contrast',matrix:  concatColorMatrices(
              sepia(), 
              tint(1.25)
            ),isSelected:false },
      ] ) 
   useEffect(()=>{
       

        setfilters(prev=>prev.map(filter=>({
          ...filter,isSelected:filter.id===selectedFilterId
        })));
   },[]);
   const onSelectFilter=(selectedFilterMatrix:Array<number>,id:string)=>{
      //  setSelectedFilterId(id);
     
        setImageFilterColorMatrix(selectedFilterMatrix,id);
        setfilters(previous=>previous.map((filter)=>({
          ...filter,isSelected:filter.id===id
        })));
   }

    return(<View style={styles.conatiner}>
          <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>colorFilterOptionsProps.onCancelButtonPressed()}>
             <Entypo name='cross'  size={25}/>       
          </TouchableOpacity>
       <FlatList   horizontal  showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id} data={filters} ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({item})=>(<FilterOptionCard id={item.id} title={item.label}
          image={colorFilterOptionsProps.imageUri} matrix={item.matrix} 
          isSelected={item.isSelected} onSelectFilter={()=>onSelectFilter(item.matrix,item.id)}/>)}/>
    </View>);
    // <View>
    //       <Image source={{uri:colorFilterOptionsProps.imageUri}} style={{height:70,width:70}}/>
    //       <Text style={{fontWeight:"500",alignSelf:"center"}}>{item.label}</Text>
    //    </View>
}
    const styles = StyleSheet.create({
          conatiner:{
              paddingTop:10,
              padding:20,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              gap:10,
              elevation: 10,
              height:250,
              borderTopStartRadius:20,
              borderTopEndRadius:20,
          }
    });