import i18n from "i18next";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../app/features/languageSlice";
import { useSessionStorage } from "@uidotdev/usehooks";
import { LOCALS } from "../../constants";
import { LanguageCard } from "./components/LanguageCard";

export const LanguageSwitcher = () => {
    const [currentLanguage, setSelectedLanguage] = useSessionStorage(
        "language",
        "English"
    );

    const dispatch = useDispatch();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        dispatch(setLanguage(lng));
        setSelectedLanguage(lng);
      };

    return (
        <div className="flex flex-col pt-4 gap-y-1 w-full">
        {Object.keys(LOCALS).map((key) => (
          <LanguageCard
            key={key}
            language={LOCALS[key]}
            isSelected={currentLanguage === LOCALS[key]}
            onSelect={changeLanguage}
          />
        ))}
      </div>
    );
}