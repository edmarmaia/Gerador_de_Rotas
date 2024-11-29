"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RoutePoint } from "@/lib/coordinates";

const schema = z.object({
  type: z.enum(["address", "coordinate"]),
  address: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
}).refine((data) => {
  if (data.type === "address") {
    return !!data.address;
  } else {
    return data.latitude !== undefined && data.longitude !== undefined;
  }
}, {
  message: "Preencha todos os campos necessários",
});

interface RouteEndpointProps {
  label: string;
  onSubmit: (point: RoutePoint) => void;
}

export function RouteEndpoint({ label, onSubmit }: RouteEndpointProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "address",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const inputType = form.watch("type");

  function handleSubmit(values: z.infer<typeof schema>) {
    const point: RoutePoint = {
      type: values.type,
      value: values.type === "address" 
        ? values.address! 
        : { lat: values.latitude!, lng: values.longitude! },
    };
    onSubmit(point);
    form.reset({
      type: "address",
      address: "",
      latitude: 0,
      longitude: 0,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="address">Endereço</SelectItem>
                  <SelectItem value="coordinate">Coordenada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {inputType === "address" ? (
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Digite o endereço" 
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" className="w-full">
          Definir {label}
        </Button>
      </form>
    </Form>
  );
}