import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { z } from "zod";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "../../api/User";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";

interface ILoginFormProps {}

const LoginSchema = z.object({
  username: z
    .string()
    .min(5, "Минимальная длина имени пользователя - 5 символов"),
  password: z.string().min(8, "Минимальная длина пароля - 8ы символов"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export const LoginForm: FC<ILoginFormProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const loginMutation = useMutation(
    {
      mutationFn: (data: { username: string; password: string }) =>
        login(data.username, data.password),
    },
    queryClient
  );

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit(({ username, password }) => {
        loginMutation.mutate({ username, password });
      })}
    >
      <FormField label="Имя" errorMessage={errors.username?.message}>
        <input type="text" {...register("username")} />
      </FormField>
      <FormField label="Пароль" errorMessage={errors.password?.message}>
        <input type="password" {...register("password")} />
      </FormField>

      <Button type="submit" isLoading={loginMutation.isPending}>
        Войти
      </Button>
    </form>
  );
};
