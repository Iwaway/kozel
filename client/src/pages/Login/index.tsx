import { useLogin } from "./useLogin";
import { LoginForm } from "../../components/LoginForm";
import { SignForm } from "../../components/SignForm";

export const Login = () => {
    const {
        setForm,
        submitLoginForm,
        submitSignForm,
        form,
        error,
        t,
    } = useLogin();

  return (
    <div className="flex justify-center items-center pt-12 flex-col w-full h-full max-w-full max-h-full">
      <div className="w-3/4 h-1/2">
        <div className="flex justify-center items-center flex-row gap-4">
          <p onClick={() => setForm("login")} style={form === "login" ? {padding: 8, backgroundColor: "orange", borderRadius: 6} : {}}>{t('auth.login.title')}</p>
          <p onClick={() => setForm("signin")} style={form === "signin" ? {padding: 8, backgroundColor: "orange", borderRadius: 6} : {}}>{t('auth.signin.title')}</p>
        </div>
            {form === "login"
            ? <LoginForm error={error} submitForm={submitLoginForm}/>
            : <SignForm error={error} submitForm={submitSignForm}/>
            }
      </div>
    </div>
  );
};