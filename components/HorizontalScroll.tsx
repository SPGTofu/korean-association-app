import { FlatList } from "react-native"
import CompanyContainer from "./CompanyContainer"

const HorizontalScroll = () => {

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]} 
            renderItem={({item}) => <CompanyContainer />}
            keyExtractor={(item) => item.toString()}
        />
    )
}

export default HorizontalScroll;
