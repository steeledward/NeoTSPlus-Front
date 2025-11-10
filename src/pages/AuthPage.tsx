import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  containerVariants,
  cardVariants,
  formItemVariants,
  buttonVariants,
} from "@/utils/animations";
import useAuthForm from "@/hooks/auth/useAuthForm";
import Logo from "@/assets/logo/Logo_cuadrado.png";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useTranslation } from "react-i18next";

const AuthPage = () => {
  const { register, handleSubmit, errors, onSubmit, isLogin, /*toogleLogin*/ } = useAuthForm();
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex justify-center items-center p-4 min-h-screen bg-app-gradient-light relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        <Card className="w-full border-0 shadow-2xl backdrop-blur-sm bg-white/80">
          <CardHeader className="pb-2 text-center relative">
            <div className="absolute right-0 top-0 mt-2 mr-4">
              <LanguageSelector />
            </div>
            <motion.div
              className="flex relative top-2 justify-center items-center px-2 mx-auto mb-4 w-72 h-auto rounded-xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
            >
              <img src={Logo} alt="Logo" className="w-fit h-fit" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text card-gradient">
                {isLogin ? t('login') : t('register')}
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <CardDescription className="text-gray-600">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isLogin ? "login-desc" : "register-desc"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isLogin ? t('login_desc') : t('register_desc')}
                  </motion.span>
                </AnimatePresence>
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    className="space-y-2"
                    key="name-field"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    variants={formItemVariants}
                    custom={0}
                  >
                    <Label htmlFor="name">{t('full_name')}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('full_name_placeholder')}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      {...register("name")}
                    />
                    {!isLogin && "name" in errors && errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="space-y-2"
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={isLogin ? 0 : 1}
              >
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email_placeholder')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </motion.div>

              <motion.div
                className="space-y-2"
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                custom={isLogin ? 1 : 2}
              >
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('password_placeholder')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    className="space-y-2"
                    key="confirm-password-field"
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    variants={formItemVariants}
                    custom={3}
                  >
                    <Label htmlFor="confirmPassword">
                      {t('confirm_password')}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t('confirm_password_placeholder')}
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      {...register("confirmPassword")}
                    />
                    {!isLogin &&
                      "confirmPassword" in errors &&
                      errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <Button className="w-full" variant="gradient">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isLogin ? "login-btn" : "register-btn"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isLogin ? t('login_button') : t('register_button')}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.form>
    </motion.div>
  );
};

export default AuthPage;
