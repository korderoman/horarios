var posicionfinal1=0, posicionfinal2;
var datos=[];
//función principal del jquery
$(document).ready(function(){
   
    crearTabla();
    //cargamos los menus de las áreas
    agregarAreas();
    //cargamos por defecto los cursos  
    agregarCursos();
    //agregamos las secciones
    agregarSeccion();
    //valores complementarios del curso
    llenarDocenteyCodigo();
    //evento de click al botón
   //dibujarCurso(cursofinal,seccionfinal);
   dibujarCurso();


 
 
});
//creacion de tabla
function crearTabla(){
    $("#horario").jqs({
        mode: "read",
        hour: 24,
        periodDuration: 60,
        data: [
            
        ],
        periodOptions: true,
        periodColors: [],
        periodTitle: "",
        periodBackgroundColor: "rgba(82, 155, 255, 0.5)",
        periodBorderColor: "#2a3cff",
        periodTextColor: "#000",
        periodRemoveButton: "Remove",
        periodTitlePlaceholder: "",
        days: ["Lu","Ma","Mi","Ju","Vi","Sa"],
        onInit: function () {},
        onAddPeriod: function () {},
        onRemovePeriod: function () {},
        onClickPeriod: function () {}
    });
    
}
//fin de creacion de tabla

//Elimina elementos duplicados de un arreglo
function eliminarDuplicados(arr){
    let i, len=arr.length, out=[], obj={}

    for(i=0;i<len;i++){
        obj[arr[i]]=0;
    }
    for(i in obj){
        out.push(i);
    }

    return out;
}
//fin de función que elimina duplicados de un arreglo
//funcion que carga los menus
function agregarAreas(){
    let area=[];
    $.getJSON("./js/bbdd.json",function(data){
        let arregloAux=[]; 
        for(let i=0;i<data.length;i++){arregloAux.push(data[i].area);}
        area=eliminarDuplicados(arregloAux);
        for(let i=0;i<area.length;i++){$("#area").append("<option value='"+area[i]+"'>"+area[i]+"</option>");}
    });
}

//function de agregar cursos
function agregarCursos(){
    let valor;
    let arregloCursos=[];
    let arregloAux=[];
    
    $("#area").change(function (e) { 
        e.preventDefault();
        $("#curso").empty();
        valor=$("#area").val();
       //código eliminado de splice de arreglo cursos, pero no tiene sentido colocarlo, solo hago esa observación
        if(valor!=0){
            $.getJSON("./js/bbdd.json",function(data) {
                for(let i=0;i<data.length;i++){
                    if(data[i].area==valor){arregloAux.push(data[i].nombre);}
                }
                arregloCursos=eliminarDuplicados(arregloAux); 
               // console.log(arregloCursos); permite revisar los elementos del array en consola
               $("#curso").append("<option value='0'>"+"Seleccione un Curso"+"</option>");
                for(let i=0;i<arregloCursos.length;i++){
                    $("#curso").append("<option value='"+arregloCursos[i]+"'>"+arregloCursos[i]+"</option>");
                
                }
                /*Hay que eliminar los elementos del auxiliar para que así siempre entregue
                una cantidad de valores limpios, sino eliminamos los elementos, estos acumulara
                los valores, es decir, si eliges ciencias y luego humanidades, aux tendra los elementos
                de ciencias y humanidades y entregará eso a arreglocursos, viendose las listas mezcladas
                de ambas áreas */
                for(let i=arregloAux.length-1;i>=0;i--){arregloAux.splice(i,1);}
                //recuerda que al modificar el valor del área todos los demás deben setearse
                $("#seccion").empty();
                $("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");
              
            });
        }else{console.log("Elija un área");
        $("#curso").append("<option value='0'>"+"Seleccione un Curso"+"</option>");
       $("#seccion").empty();
      $("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");
        }
    });
}

function agregarSeccion() {
    //recuerda que todas las funciones se basan en el hecho que se ha seleccionado un curso, será en submit donde se revisará si hay un elemento no seleccionado
    let valor;
    let arregloSeccion=[];
    let arregloAux=[];

    $("#curso").change(function (e2) {
        e2.preventDefault(); 
        $("#seccion").empty();
        valor=$("#curso").val();
        if(valor!=0){
            $.getJSON("./js/bbdd.json",function(data) {
                for(let i=0;i<data.length;i++){
                    if(data[i].nombre==valor){arregloAux.push(data[i].seccion);}
                }
                arregloSeccion=eliminarDuplicados(arregloAux); 
               // console.log(arregloCursos); permite revisar los elementos del array en consola
               $("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");
                for(let i=0;i<arregloSeccion.length;i++){$("#seccion").append("<option value='"+arregloSeccion[i]+"'>"+arregloSeccion[i]+"</option>");}
                for(let i=arregloAux.length-1;i>=0;i--){arregloAux.splice(i,1);}});
        }else{console.log("Elija una sección");$("#seccion").append("<option value='0'>"+"Seleccione una Sección"+"</option>");} 
        
    });
 
}
//se basa en el hecho que se cambiaron estas 3 constantes
function llenarDocenteyCodigo(){
    let area=$("#area").val();
    let curso=$("#curso").val();
    let seccion=$("#seccion").val();
    let docenteT;
    let docenteP;
    let aulaT, aulaP;
    let self=this.dibujarCurso;
   
    $("#area").change(function () {
        area=$("#area").val();
        $("#curso").change(function () {
           curso=$("#curso").val(); 
            $("#seccion").change(function(){
               seccion=$("#seccion").val();
                if(area!=0 && curso!=0 && seccion!=0){
                    //console.log("entre");
                    $.getJSON("./js/bbdd.json",function (data) {
                        datos=data;
                            for(let i=0;i<data.length;i++){
                                if(data[i].area==area && data[i].nombre==curso && data[i].seccion==seccion ){
                                                                                
                                    if(data[i].tipo=="P" || data[i].tipo=="LAB"){
                                        docenteP=data[i].docente;
                                        aulaP=data[i].aula;
                                        $("#profesorP").val(docenteP);
                                        $("#aulaP").val(aulaP);
                                        posicionfinal1=i;
                                        
                                    }
                                     if(data[i].tipo=="T"){
                                        docenteT=data[i].docente;
                                        aulaT=data[i].aula;
                                        $("#profesorT").val(docenteT);
                                        $("#aulaT").val(aulaT);
                                        posicionfinal2=i;
                                    }
               
                                }
                            }
                        }
                    );
                   
                }else{
                    console.log("Falta algún dato elegir");
                   
                }

            });
         });
      });
   
}


function dibujarCurso(){
   
    $("#aplicar").click(function (e) { 
        //podría ser que solo necesitemos la posicion, eso podría eliminar el uso de mas variables en el espacio global,
        //¿Qué te parece si solo capturamos el i de cada opción y el arreglo por supuesto.
        e.preventDefault();
        let posicionf1=posicionfinal1;
        let posicionf2=posicionfinal2;
        let arreglo=datos;
        

        let cursof=arreglo[posicionf1].nombre;
        let seccionf=arreglo[posicionf1].seccion;
        let diaf=parseInt(arreglo[posicionf1].dia);
        let horai=parseInt(arreglo[posicionf1].inicia)-8;
        let horaf=parseInt(arreglo[posicionf1].termina)-8;
        $("#horario").jqs('import', [
            {
                "day": diaf,
                "periods":[{"start":""+horai+":00","end":""+horaf+":00","title":cursof,"backgroundColor":"rgba(82, 155, 235, 0.5)","borderColor":"rgb(42, 60, 255)","textColor":"rgb(0, 0, 0)"}]
            }]);
        //reconvertir el excel a un json, no te olvides de estadística aplicada
        console.log(cursof);
        console.log(seccionf);
        console.log(posicionf1);
        console.log("inicio: "+arreglo[posicionf1].inicia + " finaliza: "+arreglo[posicionf1].termina);
        console.log(posicionf2);
        console.log("inicio: "+arreglo[posicionf2].inicia + " finaliza: "+arreglo[posicionf2].termina);

    });
}

