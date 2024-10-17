import Toast from "react-native-toast-message";

export const handleCreateToast = (type, text, position) => {
    Toast.show({
        type: type,
        text1: text,
        position: position,
        visibilityTime: 3000
    });
};