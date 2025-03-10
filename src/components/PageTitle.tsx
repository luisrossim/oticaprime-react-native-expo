import { colors } from '@/utils/constants/colors';
import { StyleSheet, Text } from 'react-native';

interface PageTitleProps {
    title: string;
    size: string
}

export function PageTitle({ title, size }: PageTitleProps){
    return (
        <Text style={[styles.title, (size == "large") ? {fontSize: 32} : {fontSize: 24} ]}>{title}</Text>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 700,
        color: colors.gray[900],
        marginBottom: 10
    }
})