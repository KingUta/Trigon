import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  blueBg: {
    backgroundColor: colors.blue,
  },
});

export default styles;