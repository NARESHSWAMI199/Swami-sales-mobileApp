

export const BASE_URL =  'https://online-foods.herokuapp.com/'

// export * from  './useNa'

export * from './useNavigation'


export const toTitleCase = (str : string) => {
    if (!!str)
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
    return "____"
  }
