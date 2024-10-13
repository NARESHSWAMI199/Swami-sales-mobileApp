import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';


const LeftContent = props => <Avatar.Icon { ...props } icon = "people" />

const CustomCard = () => (
  <Card style={{width:'100%',height:'100%'}}>
  <Card.Title title= "Swami sales" subtitle = "jaipur" left = { LeftContent } />
    <Card.Content>
    <Text variant="titleLarge" > Mac m1 pro </Text>
      < Text variant = "bodyMedium" > this is dummy product. </Text>
        </Card.Content>
        < Card.Cover source = {{ uri: 'https://picsum.photos/700' }} />
          < Card.Actions >
          <Button>Cancel </Button>
          < Button > Ok </Button>
          </Card.Actions>
          </Card>
);

// const style = StyleSheet.create({
  
// })

export default CustomCard;