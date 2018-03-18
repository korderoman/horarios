$(document).ready(function(){
   
    $.getJSON("./js/bbdd.json", function (data) {
            horario= new Horarios(data);
            horario.crearTabla();
            horario.agregarAreas();
            horario.agregarCursos();
            horario.agregarSeccion();
            horario.llenarDocenteyCodigo();
            horario.dibujarCurso();
        }
    );
 
});

class Horarios{
    constructor(data){
        this.datos=data;
        this.posiciones=[];
        this.curso;
        this.area;
        this.seccion
    } 

    crearTabla(){
        $("#horario").jqs({
            mode: "edit",
            hour: 24,
            periodDuration: 60,
            data: [],
            periodOptions: false,
            periodRemoveButton: "Eliminar",
            days: ["Lu","Ma","Mi","Ju","Vi","Sa"],
            
        });
    }

    agregarAreas(){
        //console.log(datos);
        let area=[];
        let arregloAux=[];
        for(let i=0;i<this.datos.length;i++){arregloAux.push(this.datos[i].area);}
        area=this.eliminarDuplicados(arregloAux);
        for(let i=0;i<area.length;i++){$("#area").append("<option value='"+area[i]+"'>"+area[i]+"</option>");}
    }

    agregarCursos(){
        let arregloCursos=[];
        let arregloAux=[];
        let self=this;
        $("#area").change(function (e) { 
            e.preventDefault();
            $("#curso").empty();
            self.area=$("#area").val();
           //código eliminado de splice de arreglo cursos, pero no tiene sentido colocarlo, solo hago esa observación
            if(self.area!=0){
                for(let i=0;i<self.datos.length;i++){if(self.datos[i].area==self.area){arregloAux.push(self.datos[i].nombre);}}
                //arregloAux=self.datos.map(function (x) {return  x.nombre; });
                arregloCursos=self.eliminarDuplicados(arregloAux); 
                // console.log(arregloCursos); permite revisar los elementos del array en consola
                $("#curso").append("<option value='0'>"+"Seleccione un Curso"+"</option>");
                for(let i=0;i<arregloCursos.length;i++){$("#curso").append("<option value='"+arregloCursos[i]+"'>"+arregloCursos[i]+"</option>");}
                for(let i=arregloAux.length-1;i>=0;i--){arregloAux.splice(i,1);}
                $("#seccion").empty();
               
                $("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");
                
                
            }else{console.log("Elija un área");
            $("#curso").append("<option value='0'>"+"Seleccione un Curso"+"</option>");
           $("#seccion").empty();
          $("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");
            }
        });
    }
    
    agregarSeccion() {
        let arregloSeccion=[];
        let arregloAux=[];
        let self=this;
        $("#curso").change(function (e) {
            e.preventDefault(); 
            $("#seccion").empty();//vaciamos todos los datos de seccion
            $("#profesorT").val("Docente T");
            $("#profesorP").val("Docente P");
            $("#aulaT").val("Aula T"); 
            $("#aulaP").val("Aula P");
            self.curso=$("#curso").val();
            if(self.curso!=0){
                    for(let i=0;i<self.datos.length;i++){if(self.datos[i].nombre==self.curso){arregloAux.push(self.datos[i].seccion);}}
                   // arregloAux=self.datos.map(function (x) {if(x.curso==self.curso){ return x.seccion;}});
                    arregloSeccion=self.eliminarDuplicados(arregloAux); 
                   // console.log(arregloCursos); permite revisar los elementos del array en consola
                   $("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");
                    for(let i=0;i<arregloSeccion.length;i++){$("#seccion").append("<option value='"+arregloSeccion[i]+"'>"+arregloSeccion[i]+"</option>");}
                    for(let i=arregloAux.length-1;i>=0;i--){arregloAux.splice(i,1);};//luego debemos de eliminar los elementos del arreglo sino se acumularán
            }else{console.log("Elija una sección");$("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");} 
            
        });
    }
    //se basa en el hecho que se cambiaron estas 3 constantes
    llenarDocenteyCodigo(){
        
        let docenteT, docenteP;
        let aulaT, aulaP;
        let self=this;
        $("#seccion").change(function (e) { 
            e.preventDefault();
            self.seccion=$("#seccion").val();
            
            if(self.seccion!=0 || typeof self.seccion!=undefined){
                for(let i=self.posiciones.length-1;i>=0;i--){self.posiciones.splice(i,1);}//eliminamos los elementos anteriores del arreglo para que no se acumule
                for(let i=0;i<self.datos.length;i++){
                    if(self.datos[i].nombre==self.curso && self.datos[i].seccion==self.seccion ){
                        self.posiciones.push(i); 
                        if(self.datos[i].tipo=="P" || self.datos[i].tipo=="LAB"){$("#profesorP").val(self.datos[i].docente); $("#aulaP").val(self.datos[i].aula);}
                        if(self.datos[i].tipo=="T"){$("#profesorT").val(self.datos[i].docente); $("#aulaT").val(self.datos[i].aula);}
 //                       if(self.datos[i].tipo=="LAB"){$("#profesorP").val(self.datos[i].docente);$("#aulaP").val(self.datos[i].aula);}
                    }
                }
                console.log(self.posiciones);
            }else{
                console.log("No se ha escogido una sección");
            }         
        });   
    }

    dibujarCurso(){
        let self=this;
        $("#aplicar").click(function (e) { 
            e.preventDefault();
            let c1=Math.round(Math.random()*255);
            let c2=Math.round(Math.random()*255);
            let c3=Math.round(Math.random()*255);
            for(let i=0;i<self.posiciones.length;i++){
                $("#horario").jqs('import',[self.crearObjeto(self.posiciones[i],c1,c2,c3)]);
            }
        });
    }
    //funciones auxiliares
    crearObjeto(posicion,c1,c2,c3){
        
        if(typeof posicion==="number"){
            return {
                "day":parseInt(this.datos[posicion].dia),
                "periods":[{"start":""+parseInt(this.datos[posicion].inicia)-8+":00",
                            "end":""+parseInt(this.datos[posicion].termina)-8+":00",
                            "title":this.datos[posicion].nombre,
                            "backgroundColor":"rgba("+c1+","+ c2+","+c3+", 0.5)",
                            "borderColor":"rgb(42, 60, 255)","textColor":"rgb(0, 0, 0)"
                            }]
            };
        }else{return {};}
    }

    eliminarDuplicados(arr){
        let i, len=arr.length, out=[], obj={}
        for(i=0;i<len;i++){obj[arr[i]]=0;}
        for(i in obj){out.push(i);}
        return out;
    }
}

