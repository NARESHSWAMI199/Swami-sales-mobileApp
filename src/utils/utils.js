 


// const host = "http://192.168.1.5:8082/"

const host = "http://10.11.13.49:8082/"
// const host = "http://202.157.82.29:8081/"
export const commentUrl = host+"comments/"
export const itemsUrl = host+"item/"
export  const itemImageUrl = itemsUrl+"image/"
export const storeUrl = host+"store/"
export  const storeImageUrl = storeUrl+"image/"
export const userImageUrl= host+"profile/"
export const dummyImageUrl = 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg';

export const getPercentage = (discount,total) =>{
    return (discount/total)*100
}

// export const themeColor = "#4E003A";
export const themeColor = "#0088cc";
export const bodyColor = "#fff";
