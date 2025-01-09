import { ComponentType, FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, ThemedStyle } from "@/theme"
import { LoginKey } from "@/queries/Auth/keys"
import { Controller, useForm } from "react-hook-form";
import { useLogin } from "@/queries/Auth/useLogin"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { initialLoginFormValue, loginFormSchema, LoginFormType } from "./helpers"
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/zustand/auth/useAuthStore"
import { useGetUserInfo } from "@/queries/Auth/useGetUserInfo"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface LoginScreenProps extends AppStackScreenProps<"Login"> { }


export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen() {
  const { themed } = useAppTheme()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const { setUser, setTokens } = useAuthStore();
  const { data: userinfo, onGetUserInfo } = useGetUserInfo();

  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()


  // Pull in navigation via hook
  // const navigation = useNavigation()

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )


  const { onLogin } = useLogin({
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.result;
      console.log(data.result)
      AsyncStorage.setItem("accessToken", accessToken).catch((error) => {
        console.error("Failed to save access token:", error);
      });
      setTokens(accessToken, refreshToken);
      //test
      if (accessToken) {
        onGetUserInfo().catch((error) => {
          console.error("Failed to get user info:", error);
        });
        console.log("🚀 ~ LoginScreen ~ userinfo:", userinfo);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    defaultValues: initialLoginFormValue,
    mode: "onChange",
    shouldFocusError: true,
    reValidateMode: "onChange",
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = (data: LoginFormType) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    onLogin(data);
    // eslint-disable-next-line react-hooks/rules-of-hooks
  };

  return (
    <Screen preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}>

      <Text text="Login" preset="heading" style={styles.title}></Text>

      <Controller
        name={LoginKey.USERNAME}
        control={control}
        render={({ field }) => (
          <TextField
            value={field.value}
            onChangeText={field.onChange}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Enter your email address"
            label="Email"
            containerStyle={themed($textField)}
            inputWrapperStyle={{ backgroundColor: '#ededed' }}
          />
        )}
      />

      <Controller
        name={LoginKey.PASSWORD}
        control={control}
        render={({ field }) => (
          <TextField
            value={field.value}
            onChangeText={field.onChange}
            containerStyle={themed($textField)}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry={isAuthPasswordHidden}
            labelTx="loginScreen:passwordFieldLabel"
            placeholder="Enter your password"
            RightAccessory={PasswordRightAccessory}
            inputWrapperStyle={{ backgroundColor: '#ededed' }}
          />
        )}
      />


      <TouchableOpacity>
        <Text text="Forgot Password?" preset="formLabel" style={styles.forgotPassword} />
      </TouchableOpacity>


      <Button
        text="Login"
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={handleSubmit(onSubmit)}
      />

      <Text text="By logging into an account you are agreeing with our" style={{ fontSize: 12, textAlign: 'center', fontWeight: 'black' }} />
      <View style={styles.policyGroup}>
        <Text text="Terms and Conditions " style={styles.policyText} />
        <Text text="and" style={{ fontSize: 12, textAlign: 'center' }} />
        <Text text=" Privacy Statement" style={styles.policyText} />
      </View>

    </Screen>
  )

})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: 70,
  paddingHorizontal: spacing.lg,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    color: 'blue',
    fontWeight: 'bold'
  },
  button: {
    marginTop: 48,
    marginBottom: 25,
    backgroundColor: '#225aeb',
    color: 'red',
    width: '80%',
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: "white"
  },
  signUpGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  policyGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  policyText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold'
  },
  forgotPassword: {
    color: 'blue',
    alignSelf: 'flex-end',
    marginTop: 5
  }
})