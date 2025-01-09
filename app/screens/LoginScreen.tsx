import { ComponentType, FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { colors, ThemedStyle } from "@/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface LoginScreenProps extends AppStackScreenProps<"Login"> { }


export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen() {
  const { themed } = useAppTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)

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

  const handleLogin = () => {
    console.log("hehe");
  }

  return (
    <Screen preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}>

      <Text text="Login" preset="heading" style={styles.title}></Text>

      <TextField
        value={email}
        onChangeText={(value) => setEmail(value)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Enter your email address"
        label="Email"
        containerStyle={themed($textField)}
        inputWrapperStyle={{ backgroundColor: '#ededed' }}
      />

      <TextField
        value={password}
        onChangeText={(value) => setPassword(value)}
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

      <TouchableOpacity>
        <Text text="Forgot Password?" preset="formLabel" style={styles.forgotPassword} />
      </TouchableOpacity>


      <Button
        text="Login"
        style={styles.button}
        textStyle={styles.buttonText}
        onPress={handleLogin}
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