const scale = {
  xs: 4,
  s: 8,
  d: 16,
  m: 24,
  xm: 32,
  xxm: 40,
  l: 48,
  xl: 56,
  xxl: 64,
  h: 96,
}

const typefaces = {
  title: 'Martian Mono',
  text: 'Sora',
}

export const gaps = {
  small: scale.s,
  regular: scale.d,
  medium: scale.m,
  large: scale.xm,
}

export const radius = {
  small: scale.s,
  medium: scale.d,
}

export const sizes = {
  medium: scale.l,
}

export const chartSizes = {
  width: 1200,
  height: 600,
}

export const textStyles = {
  documentTitle: {
    fontFamily: typefaces.title,
    fontSize: scale.h,
    fontWeight: 'ExtraBold',
    lineHeight: {
      unit: 'AUTO',
    },
  },
  slideTitle: {
    fontFamily: typefaces.title,
    fontSize: scale.xxl,
    fontWeight: 'Bold',
    lineHeight: {
      unit: 'AUTO',
    },
  },
  slideSubTitle: {
    fontFamily: typefaces.text,
    fontSize: scale.xm,
    fontWeight: 'SemiBold',
    lineHeight: {
      unit: 'AUTO',
    },
  },
  slideAccentLabel: {
    fontFamily: typefaces.text,
    fontSize: scale.xm,
    fontWeight: 'SemiBold',
    lineHeight: {
      unit: 'AUTO',
    },
  },
  slideLabel: {
    fontFamily: typefaces.text,
    fontSize: scale.xm,
    fontWeight: 'Regular',
    lineHeight: {
      unit: 'AUTO',
    },
  },
  slideAccentText: {
    fontFamily: typefaces.text,
    fontSize: scale.xxm,
    fontWeight: 'Regular',
    lineHeight: {
      value: 150,
      unit: 'PERCENT',
    },
  },
  slideText: {
    fontFamily: typefaces.text,
    fontSize: scale.xm,
    fontWeight: 'Regular',
    lineHeight: {
      value: 150,
      unit: 'PERCENT',
    },
  },
  slideDataViz: {
    fontFamily: typefaces.text,
    fontSize: scale.d,
    fontWeight: 'Regular',
    lineHeight: {
      unit: 'AUTO',
    },
  },
  slideTimer: {
    fontFamily: typefaces.title,
    fontSize: scale.xl,
    fontWeight: 'Bold',
    lineHeight: {
      unit: 'AUTO',
    },
  },
}

export const colors = {
  lightColor: 'FFFEC3',
  onLightColor: 'FEE8A8',
  darkColor: '493200',
  grayColor: 'AFBCCF',
  redColor: 'FFAFA3',
  orangeColor: 'FFC470',
  yellowColor: 'FFD966',
  greenColor: '85E0A3',
  blueColor: '80CAFF',
  violetColor: 'D9B8FF',
  pinkColor: 'FFBDF2',
  lightGrayColor: 'E6E6E6',
}
