import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/store/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "@/components/OAuth";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must contain at least 6 character(s)")
    .required("Password is required"),
});
const Login = () => {
  const form = useForm<yup.InferType<typeof loginSchema>>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const currentChat = useChat((state) => state.currentChat);
  // console.log(currentChat);

  const { mutateAsync, isPending } = useLogin();
  const login = useAuth((state) => state.login);
  const navigate = useNavigate();
  function onSubmit(data: yup.InferType<typeof loginSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    mutateAsync(data)
      .then((res) => {
        toast({
          title: "Login Successful",
          description: "You have logged in successfully!",
        });
        console.log(res.data);
        const resData = res.data;
        login(resData.data);
        navigate("/chat", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response.data.error;
        const errors = err.response.data?.errors;
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        console.log(errors);
        console.log(err);

        if (errors?.length > 0) {
          errors.forEach(
            (err: { path: string[] | string; message: string }) => {
              let path = Array.isArray(err.path) ? err.path[0] : err.path;
              form.setError(
                path as "email" | "password",
                {
                  message: err.message,
                  type: "serverError",
                },
                { shouldFocus: true }
              );
            }
          );
        }
      });
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-md  md:w-1/3 w-full px-1">
        <Card className=" ">
          {/* <h3 className="text-3xl font-bold text-center">Login</h3> */}
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Sign In to your account </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <Icons.spinner className="mr-2 h-4 w-4" />}
                  Sign In
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <OAuth />
          </CardContent>
          <CardFooter>
            <div className="flex justify-center items-center ">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-700 font-semibold transition duration-200 underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
