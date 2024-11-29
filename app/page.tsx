"use client";

import { MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { CoordinateInput } from "@/components/coordinate-input";
import { RouteEndpoint } from "@/components/route-endpoint";
import { RouteMap } from "@/components/route-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Coordinate, RoutePoint } from "@/lib/coordinates";

export default function Home() {
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [startPoint, setStartPoint] = useState<RoutePoint>();
  const [endPoint, setEndPoint] = useState<RoutePoint>();
  
  const handleAddCoordinates = (newCoordinates: Coordinate[]) => {
    setCoordinates([...coordinates, ...newCoordinates]);
  };

  const handleClearRoute = () => {
    setCoordinates([]);
    setStartPoint(undefined);
    setEndPoint(undefined);
  };

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Gerador de Rotas</h1>
          <p className="text-muted-foreground">
            Adicione coordenadas e pontos de início/fim para gerar uma rota personalizada
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ponto Inicial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RouteEndpoint
                label="Ponto Inicial"
                onSubmit={setStartPoint}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ponto Final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RouteEndpoint
                label="Ponto Final"
                onSubmit={setEndPoint}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Pontos Intermediários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CoordinateInput onAddCoordinates={handleAddCoordinates} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Rota Gerada
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearRoute}
              disabled={coordinates.length === 0 && !startPoint && !endPoint}
            >
              Limpar Rota
            </Button>
          </CardHeader>
          <CardContent>
            <RouteMap 
              coordinates={coordinates}
              startPoint={startPoint}
              endPoint={endPoint}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}