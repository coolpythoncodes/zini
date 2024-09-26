"use client";

import FormErrorTextMessage from "@/components/common/form-error-text-message";
import { Icons } from "@/components/common/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDisclosure from "@/hooks/use-disclosure.hook";
import { routes } from "@/lib/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { object, string, type InferType } from "yup";

const loginFormSchema = object({
  name: string().required("Name is required"),
  phoneNumber: string().required("Phone number is required"),
  password: string().required("Password is required"),
}).required();

type FormData = InferType<typeof loginFormSchema>;

const LoginForm = () => {
  const { isOpen, onOpen } = useDisclosure();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginFormSchema),
  });
  const onSubmit = (data: FormData) => {
    console.log(data);
    router.replace(routes.dashboard);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-[21px]">
      <div className="space-y-4">
        <div className="grid gap-y-1">
          <div className="relative rounded bg-[#F8FDF5]">
            <Input
              className="h-[54px] rounded pl-9"
              placeholder="Name"
              {...register("name")}
            />
            <Icons.profile className="absolute left-0 top-2 m-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <FormErrorTextMessage errors={errors.name} />
        </div>

        <div className="grid gap-y-1">
          <div className="relative rounded bg-[#F8FDF5]">
            <Input
              className="h-[54px] rounded pl-9"
              placeholder="Contact Info (phone no)"
              {...register("phoneNumber")}
            />
            <Phone className="absolute left-0 top-2 m-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <FormErrorTextMessage errors={errors.phoneNumber} />
        </div>

        <div className="grid gap-y-1">
          <div className="relative rounded bg-[#F8FDF5]">
            <Input
              type="password"
              className="h-[54px] rounded pl-9"
              placeholder="Password"
              {...register("password")}
            />
            <Lock className="absolute left-0 top-2 m-2.5 h-5 w-5 text-muted-foreground" />
          </div>
          <FormErrorTextMessage errors={errors.phoneNumber} />
        </div>
      </div>
      <Button
      // onClick={onOpen} disabled={isOpen}
      >
        {isOpen ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Sign up
      </Button>
    </form>
  );
};

export default LoginForm;
