import React from 'react';
import Image from 'react-native-scalable-image';

const ResizedImage = ({uri}:{uri:string}) => (
   <Image
       width={200} height={250} style={{ marginVertical: 10 }}
       source={{uri: uri }}
   />
);

export default ResizedImage;