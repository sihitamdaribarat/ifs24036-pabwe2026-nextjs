import Swal, { SweetAlertResult } from "sweetalert2";

export async function showSuccessDialog(
  title: string,
  text?: string
): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#3b82f6",
  });
}

export async function showErrorDialog(
  title: string,
  text?: string
): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#ef4444",
  });
}

export async function showWarningDialog(
  title: string,
  text?: string
): Promise<SweetAlertResult> {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#f59e0b",
  });
}

export async function showConfirmDialog(
  title: string,
  text?: string,
  confirmButtonText: string = "Ya, lanjutkan"
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText,
    cancelButtonText: "Batal",
  });

  return result.isConfirmed;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
