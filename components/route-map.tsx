"use client";

import { Button } from "@/components/ui/button";
import { generateGoogleMapsLink } from "@/lib/coordinates";
import { ExternalLink, Shuffle } from "lucide-react";
import type { Coordinate, RoutePoint } from "@/lib/coordinates";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface RouteMapProps {
  coordinates: Coordinate[];
  startPoint?: RoutePoint;
  endPoint?: RoutePoint;
}

export function RouteMap({ coordinates, startPoint, endPoint }: RouteMapProps) {
  const [optimizeRoute, setOptimizeRoute] = useState(false);
  const googleMapsLink = generateGoogleMapsLink(coordinates, startPoint, endPoint, optimizeRoute);
  const hasPoints = coordinates.length > 0 || startPoint || endPoint;
  const hasMultiplePoints = coordinates.length > 1 || 
    (coordinates.length === 1 && (startPoint || endPoint)) ||
    (startPoint && endPoint);

  return (
    <div className="space-y-4">
      {hasPoints ? (
        <>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">Pontos da Rota:</h3>
            <ul className="space-y-1">
              {startPoint && (
                <li className="text-sm font-medium">
                  Ponto Inicial: {startPoint.type === 'address' 
                    ? startPoint.value 
                    : `${(startPoint.value as Coordinate).lat.toFixed(6)}, ${(startPoint.value as Coordinate).lng.toFixed(6)}`}
                </li>
              )}
              {coordinates.map((coord, index) => (
                <li key={index} className="text-sm">
                  Ponto {index + 1}: {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                </li>
              ))}
              {endPoint && (
                <li className="text-sm font-medium">
                  Ponto Final: {endPoint.type === 'address' 
                    ? endPoint.value 
                    : `${(endPoint.value as Coordinate).lat.toFixed(6)}, ${(endPoint.value as Coordinate).lng.toFixed(6)}`}
                </li>
              )}
            </ul>
          </div>

          {hasMultiplePoints && (
            <div className="flex items-center space-x-2 py-2">
              <Switch
                id="optimize-route"
                checked={optimizeRoute}
                onCheckedChange={setOptimizeRoute}
              />
              <Label htmlFor="optimize-route" className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                Otimizar rota (encontrar caminho mais rápido)
              </Label>
            </div>
          )}
          
          <Button
            className="w-full"
            onClick={() => window.open(googleMapsLink, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir no Google Maps
          </Button>
        </>
      ) : (
        <p className="text-center text-muted-foreground py-8">
          Adicione pontos para visualizar a rota no mapa
        </p>
      )}
    </div>
  );
}