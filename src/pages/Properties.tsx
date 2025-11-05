import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Calendar, DollarSign, Search, Plus, Eye, Edit, MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useProperties } from "@/hooks/useProperties";
import { useNavigate } from "react-router-dom";
import { PropertyQRCode } from "@/components/properties/PropertyQRCode";
import { PropertyActionsDialog } from "@/components/properties/PropertyActionsDialog";


export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<{id: string, name: string} | null>(null);
  const navigate = useNavigate();
  
  const { properties, loading, error } = useProperties();

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const statusConfig = {
    active: { label: "نشط", className: "bg-green-500 text-white" },
    maintenance: { label: "تحت الصيانة", className: "bg-yellow-500 text-white" },
    inactive: { label: "غير نشط", className: "bg-gray-500 text-white" }
  };

  const typeConfig = {
    commercial: { label: "تجاري", className: "bg-blue-500 text-white" },
    residential: { label: "سكني", className: "bg-green-500 text-white" },
    industrial: { label: "صناعي", className: "bg-orange-500 text-white" },
    office: { label: "مكتبي", className: "bg-purple-500 text-white" },
    retail: { label: "تجزئة", className: "bg-teal-500 text-white" }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">جاري تحميل العقارات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-destructive">خطأ في تحميل العقارات: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">إدارة العقارات</h1>
                <p className="text-muted-foreground">إدارة ومتابعة العقارات والممتلكات</p>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/properties/add")}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة عقار جديد
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                     <div>
                       <p className="text-sm text-muted-foreground">إجمالي العقارات</p>
                       <p className="text-2xl font-bold text-primary">{properties.length}</p>
                     </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">نشطة</p>
                       <p className="text-2xl font-bold text-green-500">
                         {properties.filter(p => p.status === "active").length}
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Building2 className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تحت الصيانة</p>
                       <p className="text-2xl font-bold text-yellow-500">
                         {properties.filter(p => p.status === "maintenance").length}
                       </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-500" />
                    </div>
                     <div>
                       <p className="text-sm text-muted-foreground">إجمالي المساحات</p>
                       <p className="text-lg font-bold text-orange-500">
                         {properties.reduce((total, p) => total + (p.area || 0), 0).toLocaleString()} م²
                       </p>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث في العقارات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="نوع العقار" />
                    </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">جميع الأنواع</SelectItem>
                       <SelectItem value="commercial">تجاري</SelectItem>
                       <SelectItem value="residential">سكني</SelectItem>
                       <SelectItem value="industrial">صناعي</SelectItem>
                       <SelectItem value="office">مكتبي</SelectItem>
                       <SelectItem value="retail">تجزئة</SelectItem>
                     </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="maintenance">تحت الصيانة</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    تصدير التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Properties Grid */}
            <div className="grid gap-4">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="card-elegant hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                     <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {/* Property Icon */}
                            {property.icon_url && (
                              <img 
                                src={property.icon_url} 
                                alt="Property icon" 
                                className="h-10 w-10 object-contain"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {property.name}
                                </h3>
                                <Badge className={typeConfig[property.type as keyof typeof typeConfig]?.className || "bg-gray-500 text-white"}>
                                  {typeConfig[property.type as keyof typeof typeConfig]?.label || property.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-primary font-medium">#{property.id.slice(0, 8)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={statusConfig[property.status as keyof typeof statusConfig]?.className || "bg-gray-500 text-white"}>
                              {statusConfig[property.status as keyof typeof statusConfig]?.label || property.status}
                            </Badge>
                            <PropertyQRCode 
                              propertyId={property.id} 
                              propertyName={property.name}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedProperty({id: property.id, name: property.name})}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        {property.description && (
                          <p className="text-sm text-muted-foreground">
                            {property.description}
                          </p>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{property.address}</span>
                          </div>
                          
                          {property.area && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span>{property.area} م²</span>
                            </div>
                          )}

                          {property.last_inspection_date && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>آخر فحص: {new Date(property.last_inspection_date).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}

                        </div>

                        {/* Additional Details */}
                        {property.rooms && (
                          <div className="text-sm text-muted-foreground">
                            عدد الغرف: {property.rooms}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            تاريخ الإنشاء: {new Date(property.created_at).toLocaleDateString('ar-SA')}
                          </div>
                          {property.next_inspection_date && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">الفحص القادم: </span>
                              <span className="font-semibold text-primary">
                                {new Date(property.next_inspection_date).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProperties.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="space-y-3">
                      <div className="text-4xl opacity-50">🏢</div>
                      <p className="text-muted-foreground text-lg">
                        {properties.length === 0 
                          ? "لا توجد عقارات مسجلة بعد" 
                          : "لا توجد عقارات تطابق معايير البحث"
                        }
                      </p>
                      {properties.length === 0 && (
                        <Button onClick={() => navigate("/properties/add")} className="mt-3">
                          <Plus className="h-4 w-4 ml-2" />
                          إضافة أول عقار
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

      {/* Property Actions Dialog */}
      {selectedProperty && (
        <PropertyActionsDialog
          propertyId={selectedProperty.id}
          propertyName={selectedProperty.name}
          open={!!selectedProperty}
          onOpenChange={(open) => !open && setSelectedProperty(null)}
        />
      )}
    </div>
  );
}