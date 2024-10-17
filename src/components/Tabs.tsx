import { Tab } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeProvider,createTheme } from '@rneui/themed';
import { Avatar } from 'react-native-elements';

interface Category {
   id : number,
   category : string,
   icon : string
}

 const CategoryTabs = (props : any) =>{
  const [items,setItems] = useState([]);
  const [index, setIndex] = useState(0);
  useEffect(()=>{
    setItems(props.items)
  },[props.items])
  return <View>
        <Tab  value={index} onChange={setIndex} dense>
          {items.map((item:Category,i)=> {
            return <Tab.Item 
            key={i}
            titleStyle={{ fontSize: 16, color : 'black'}}
            // icon={{ name: 'shooes', type: 'ionicon', color: 'white' }}
            >
            <Avatar  rounded
                        size={40}
                    source={{
                        uri:item.icon
                    }} />
              {item.category}
              </Tab.Item>
          })}
          
        </Tab>
      </View>
}



const theme = createTheme({
  // lightColors: {
  //   primary: '#e7e7e8',
  // },
  darkColors: {
    primary: '#000',
  },
  mode: 'dark',
});


export default CategoryTabs;