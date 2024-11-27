import { useTranslation } from "react-i18next";

interface SignFormProps {
    submitForm: () => void;
    error: string | undefined;
}

export const SignForm = (props: SignFormProps) => {
    const {
        submitForm,
        error,
    } = props;

    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <p>{t('auth.email')}</p>
            <input className="border-[2px] rounded-[6px] p-1 border-orange-400" id="email" type="email" name="email"/>
            <p>{t('auth.password')}</p>
            <input className="border-[2px] rounded-[6px] p-1 border-orange-400" id="password" type="password" name="password"/>
            <p>{t('auth.signin.nickname')}</p>
            <input className="border-[2px] rounded-[6px] p-1 border-orange-400" id="nickname" type="text" name="nickname"/>
            <div className="mt-6" id="captchaBlock"/>
            <input className="border-[2px] rounded-[6px] p-1 border-orange-400" id="captchaAnswer" type="text" name="captcha"/>
            <p className="text-red-600">{error}</p>
            <button className="p-1 bg-green-200 border-[2px] border-green-950 rounded-[6px] w-36" onClick={submitForm}>{t('auth.signin.submit')}</button>
        </div>
    )
};