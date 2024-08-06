import { Image, StyleSheet, Platform, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import HorizontalScroll from '@/components/HorizontalScroll';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image />
      }>
        <Text style={styles.headerContainer}>Restaurants</Text>
        <HorizontalScroll />
        <Text style={styles.headerContainer}>Businesses</Text>
        <HorizontalScroll />
        <HorizontalScroll />
        <HorizontalScroll />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    color: '#fff',
    gap: 8,
    fontSize: 24,

  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
