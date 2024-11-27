import { useNavigate } from "react-router-dom";
import { Deals } from "../enums/gameCardEnums";

export function useUtils() {
    const navigation = useNavigate();

    const navigateTo = (divLink: string) => {
        navigation(divLink);
    };

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const dealTimeot = (deal: Deals) => {
        switch (deal) {
            case 'all':
                return 2000;
            case 'one':
                return 5000;
            case 'pants':
                return 10000;
            case 'satellite':
                return 30000;
            default:
                return 0;
        }
    };

    return{
        navigateTo,
        dealTimeot,
        randomIntFromInterval,
    }
}

