import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';


const LeftContent = (props : any) => <Avatar.Icon { ...props } icon = "folder" />

const CustomCard = (props:any) => (
  <Card style={style.card}>
  <Card.Title titleStyle={style.titleStyle} title= "Swami sales" subtitle = "jaipur" left = { LeftContent } />
    <Card.Content>
    <Text variant="titleLarge" style={{fontSize:16,fontWeight:'bold'}} > Mac m1 pro </Text>
      < Text variant = "bodyMedium" > this is dummy product. </Text>
        </Card.Content>
        < Card.Cover source = {{ uri: props.url }} />
          < Card.Actions >
          <Button>Cancel </Button>
          < Button > Ok </Button>
          </Card.Actions>
          </Card>
);

const style = StyleSheet.create({
  card : {
    width:'98%',
    paddingBottom:3,
    marginBottom : 3
  },
  titleStyle:{
    fontSize:18,
    fontWeight : 'bold'
  }

})

export default CustomCard;