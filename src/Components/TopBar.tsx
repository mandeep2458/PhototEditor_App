import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Lucide from "@react-native-vector-icons/lucide";

type TopBarProps={onCancel:()=>void,onUndo:()=>void,onRedo:()=>void,onSave:()=>void,
    onDownload:()=>void,
}
export function TopBar({onCancel,onUndo,onRedo,onSave,onDownload}:TopBarProps){
    const width=Dimensions.get('window').width
    return(
        <View style={[styles.topBar, {width:width}]}>
            <TouchableOpacity onPress={onCancel}>
                <Entypo name='cross' color={'#fff'} size={25}/>       
            </TouchableOpacity>

            <View style={styles.undoRedoContainer}>
                <TouchableOpacity onPress={onUndo}>
                <Lucide name='undo-2' color={'#fff'} size={25}/>       
                </TouchableOpacity>

                <TouchableOpacity onPress={onRedo}>
                 <Lucide name="redo-2" color={'#fff'} size={25}/>
                </TouchableOpacity>
            </View>
            
                    <TouchableOpacity onPress={onSave} >
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDownload} >
                        <Lucide name="download" color={'#fff'} size={25}/>
                    </TouchableOpacity>
             
         
</View>
    );
}
const styles = StyleSheet.create({
    topBar: {
        height: 60,
        backgroundColor: '#3478C5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#3478C5',
        
    },

    closeText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
    },

    undoRedoContainer: {
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
    },

    iconText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '500',
    },

    saveButton: {
        backgroundColor: '#3478C5',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
    },

    saveText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});