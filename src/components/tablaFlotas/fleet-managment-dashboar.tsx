"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// Datos de ejemplo para la tabla
const fleetData = [
  {
    id: "001",
    plate: "ABC-123",
    model: "Toyota Hilux 2022",
    driver: "Juan Pérez",
    status: "Activo",
    capacity: "1 tonelada",
  },
  {
    id: "002",
    plate: "XYZ-456",
    model: "Ford Ranger 2021",
    driver: "María López",
    status: "En mantenimiento",
    capacity: "1.5 toneladas",
  },
  {
    id: "003",
    plate: "DEF-789",
    model: "Chevrolet S10 2023",
    driver: "Carlos Rodríguez",
    status: "Inactivo",
    capacity: "2 toneladas",
  },
  {
    id: "004",
    plate: "GHI-012",
    model: "Nissan Frontier 2022",
    driver: "Ana Martínez",
    status: "Activo",
    capacity: "1.2 toneladas",
  },
  {
    id: "005",
    plate: "JKL-345",
    model: "Mitsubishi L200 2021",
    driver: "Roberto Sánchez",
    status: "Activo",
    capacity: "2.5 toneladas",
  },
]

// Lista de conductores disponibles
const availableDrivers = [
  { id: "D001", name: "Juan Pérez" },
  { id: "D002", name: "María López" },
  { id: "D003", name: "Carlos Rodríguez" },
  { id: "D004", name: "Ana Martínez" },
  { id: "D005", name: "Roberto Sánchez" },
  { id: "D006", name: "Laura Gómez" },
  { id: "D007", name: "Miguel Torres" },
]

// Estados disponibles para los vehículos
const vehicleStatuses = ["Activo", "En mantenimiento", "Inactivo"]

// Esquema de validación para el formulario
const formSchema = z.object({
  plate: z.string().min(6, "La placa debe tener al menos 6 caracteres"),
  model: z.string().min(3, "El modelo debe tener al menos 3 caracteres"),
  driver: z.string().min(1, "Debe seleccionar un conductor"),
  capacity: z.string().min(1, "Debe ingresar la capacidad"),
  status: z.string().min(1, "Debe seleccionar un estado"),
})

// Tipo para el formulario
type FormValues = z.infer<typeof formSchema>

export function FleetManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fleetItems, setFleetItems] = useState(fleetData)

  // Configuración del formulario con React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plate: "",
      model: "",
      driver: "",
      capacity: "",
      status: "Activo",
    },
  })

  // Función para manejar el envío del formulario
  function onSubmit(data: FormValues) {
    // Crear un nuevo ID basado en el último ID + 1
    const newId = String(Number(fleetItems[fleetItems.length - 1]?.id || "0") + 1).padStart(3, "0")

    // Encontrar el nombre del conductor seleccionado
    const selectedDriver = availableDrivers.find((driver) => driver.id === data.driver)?.name || data.driver

    // Crear el nuevo vehículo
    const newVehicle = {
      id: newId,
      plate: data.plate.toUpperCase(),
      model: data.model,
      driver: selectedDriver,
      status: data.status,
      capacity: data.capacity,
    }

    // Añadir el nuevo vehículo a la lista
    setFleetItems([...fleetItems, newVehicle])

    // Cerrar el modal y resetear el formulario
    setIsModalOpen(false)
    form.reset()
  }

  // Filtrar datos según el término de búsqueda
  const filteredData = fleetItems.filter(
    (item) =>
      item.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driver.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Función para determinar el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "en mantenimiento":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "inactivo":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1D3557] mb-6">Gestión de Flota</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-[#457B9D] hover:bg-[#2A5A7A] w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Agregar Unidad
        </Button>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Placa</TableHead>
                <TableHead className="font-semibold">Modelo</TableHead>
                <TableHead className="font-semibold">Conductor</TableHead>
                <TableHead className="font-semibold">Capacidad</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.driver}</TableCell>
                  <TableCell>{vehicle.capacity || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(vehicle.status)} border-0`}>
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 text-[#1D3557]">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal para agregar nueva unidad */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#1D3557]">Agregar Nueva Unidad</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota Hilux 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conductor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar conductor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input placeholder="2.5 toneladas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#457B9D] hover:bg-[#2A5A7A]">
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}