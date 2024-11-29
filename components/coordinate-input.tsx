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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCoordinatesString } from "@/lib/coordinates";
import type { Coordinate } from "@/lib/coordinates";

const singlePointSchema = z.object({
  latitude: z.coerce
    .number()
    .min(-90)
    .max(90)
    .describe("Latitude (-90 to 90)"),
  longitude: z.coerce
    .number()
    .min(-180)
    .max(180)
    .describe("Longitude (-180 to 180)"),
});

const batchInputSchema = z.object({
  coordinates: z.string().min(1, "Digite as coordenadas"),
});

interface CoordinateInputProps {
  onAddCoordinates: (coordinates: Coordinate[]) => void;
}

export function CoordinateInput({ onAddCoordinates }: CoordinateInputProps) {
  const singleForm = useForm<z.infer<typeof singlePointSchema>>({
    resolver: zodResolver(singlePointSchema),
    defaultValues: {
      latitude: 0,
      longitude: 0,
    },
  });

  const batchForm = useForm<z.infer<typeof batchInputSchema>>({
    resolver: zodResolver(batchInputSchema),
    defaultValues: {
      coordinates: "",
    },
  });

  function onSingleSubmit(values: z.infer<typeof singlePointSchema>) {
    onAddCoordinates([{ lat: values.latitude, lng: values.longitude }]);
    singleForm.reset({ latitude: 0, longitude: 0 });
  }

  function onBatchSubmit(values: z.infer<typeof batchInputSchema>) {
    const coordinates = parseCoordinatesString(values.coordinates);
    if (coordinates.length > 0) {
      onAddCoordinates(coordinates);
      batchForm.reset({ coordinates: "" });
    }
  }

  return (
    <Tabs defaultValue="single" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single">Ponto Único</TabsTrigger>
        <TabsTrigger value="batch">Múltiplos Pontos</TabsTrigger>
      </TabsList>

      <TabsContent value="single">
        <Form {...singleForm}>
          <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={singleForm.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="-90 a 90"
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
                control={singleForm.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="-180 a 180"
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
            <Button type="submit" className="w-full">
              Adicionar Ponto
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="batch">
        <Form {...batchForm}>
          <form onSubmit={batchForm.handleSubmit(onBatchSubmit)} className="space-y-4">
            <FormField
              control={batchForm.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordenadas (uma por linha ou separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="-03.820855,-38.587788&#10;-03.825678,-38.590123"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Adicionar Pontos
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}