import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { useRegister } from "@/hooks/useRegister";
import { useAuth } from "@/store/AuthContext";
import { Link, useNavigate } from "react-router-dom";
const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  name: yup
    .string()
    .trim()
    .min(3, "User name must be at least 3 characters")
    .required("User name is required"),
  avatar: yup
    .mixed()
    // .test("fileRequired", "A file is required", (value) => {
    //   // Check if a file is selected
    //   if (!value || (value as FileList).length === 0) return false; // Skip test if no file
    //   return true; // Placeholder, will always return true if file is present
    // })
    .test("fileSize", "File size is too large", (value) => {
      const files = value as FileList;
      // If no files or length is 0, skip this test
      if (!files || files.length === 0) return true;
      return files[0].size <= 2000000; // 2MB limit
    })
    .test("fileType", "Unsupported File Format", (value) => {
      const files = value as FileList;
      // If no files or length is 0, skip this test
      if (!files || files.length === 0) return true;
      return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        files[0].type
      );
    }),
  password: yup
    .string()
    .min(3, "Password must contain at least 6 character(s)")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
interface FormData {
  name: string;
  email: string;
  password: string;
  avatar?: any;
}
const Register = () => {
  const form = useForm<yup.InferType<typeof registerSchema>>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });
  const { mutateAsync, isPending } = useRegister();
  const login = useAuth((state) => state.login);
  const navigate = useNavigate();
  function onSubmit(data: yup.InferType<typeof registerSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    console.log(data);
    if (data.avatar) {
      const file = data.avatar as FileList;
      formData.append("avatar", file[0]);
    }
    // return;
    // @ts-ignore
    mutateAsync(formData)
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
                path as "email" | "password" | "name",
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
            <CardTitle className="text-2xl">Create an account</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="User name" {...field} />
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" type="email" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                      This is your public display name.
                    </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { onChange, onBlur, ref } }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            onChange(e.target.files); // Pass the file list to onChange
                          }}
                          onBlur={onBlur} // Handle blur event
                          ref={ref}
                          accept="image/jpeg, image/png, image/gif, image/webp"
                        />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
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
                <Button
                  type="submit"
                  className="w-full"
                  //  disabled={isPending}
                >
                  {isPending && <Icons.spinner className="mr-2 h-4 w-4" />}
                  Create account
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
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline">
                <Icons.gitHub className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline" className="w-full">
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center items-center ">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-700 font-semibold transition duration-200 underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
