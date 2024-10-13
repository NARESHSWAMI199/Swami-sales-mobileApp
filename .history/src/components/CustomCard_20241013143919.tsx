import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';


const LeftContent = props => <Avatar.Icon { ...props } icon = "avtar" />

const CustomCard = () => (
  <Card style={{width:'100%'}}>
  <Card.Title title= "Card Title" subtitle = "Card Subtitle" left = { LeftContent } />
    <Card.Content>
    <Text variant="titleLarge" > Card title </Text>
      < Text variant = "bodyMedium" > Card content </Text>
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