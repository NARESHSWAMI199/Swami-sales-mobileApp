import React, { useState } from 'react'
import { View } from 'react-native'
import { Searchbar } from 'react-native-paper'

function CustomSearch() {

    const [search,setSearch] = useState(false)
    const [query, setQuery] = useState("")

    const updateSearch = (search : any) => {
        setQuery(search);
    };


  return (
    <View  
            style={{
                display : 'flex',
                flexDirection : 'row',
                paddingHorizontal: 20,
                paddingBottom : 20,
                paddingTop : 10,
                borderRadius : 5,
                margin : 0
            }}
        >
        <Searchbar
            placeholder="Search"
            onChangeText={updateSearch}
            value={query}
            onClearIconPress={()=>{
                setQuery("")
                setSearch(search ? false : true)
            }}
            onSubmitEditing={() => setSearch(search ? false : true)}
            style={{
                 width : '100%'}}
            />
        </View>
  )
}

export default CustomSearch