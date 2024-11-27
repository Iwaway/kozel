import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "../../components/LanguageSwitcher"
import { useTranslation } from "react-i18next";

export const Settings = () => {

    const navigate = useNavigate();
    const { t } = useTranslation();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <main className="p-3 min-w-full absolute top-0 flex justify-center flex-col items-center">
            <div className="flex justify-center items-center flex-col w-1/2">
                <p>{t('changeLanguage')}</p>
                <LanguageSwitcher/>
            </div>
        </main>
    )
}